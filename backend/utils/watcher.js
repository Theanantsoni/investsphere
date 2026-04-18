// backend/utils/watcher.js

const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// 🔥 TEMP MEMORY STORE (OLD VALUES CACHE)
const previousDocs = new Map();

const buildMessage = (collection, action, eventType) => {
  const name = collection.charAt(0).toUpperCase() + collection.slice(1);

  if (eventType === "collection_create")
    return `Collection created: ${name}`;
  if (eventType === "collection_delete")
    return `Collection deleted: ${name}`;

  if (action === "insert") return `New record added in ${name}`;
  if (action === "update") return `Record updated in ${name}`;
  if (action === "delete") return `Record deleted from ${name}`;

  return `Change detected in ${name}`;
};

const deepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
};

const startWatcher = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("[WATCHER] Mongo not connected");
      return;
    }

    console.log("[WATCHER] Started 🚀");

    const changeStream = mongoose.connection.watch([], {
      fullDocument: "updateLookup",
    });

    changeStream.on("change", async (change) => {
      try {
        const { operationType, ns, fullDocument, documentKey } = change;
        const collectionName = ns?.coll;

        if (
          !collectionName ||
          collectionName === "notification" ||
          collectionName.startsWith("system")
        )
          return;

        let action = null;
        let details = {};
        let eventType = "data_change";

        const id = documentKey?._id?.toString();

        /* ================= COLLECTION EVENTS ================= */
        if (operationType === "create") {
          eventType = "collection_create";
        } else if (operationType === "drop") {
          eventType = "collection_delete";
        }

        /* ================= INSERT ================= */
        else if (operationType === "insert") {
          action = "insert";

          const after = deepClone(fullDocument || {});

          details = {
            before: null,
            after,
            updatedFields: after,
            removedFields: [],
          };

          // 🔥 cache store
          previousDocs.set(id, after);
        }

        /* ================= UPDATE ================= */
        else if (operationType === "update") {
          action = "update";

          const after = deepClone(fullDocument || {});
          const cachedBefore = previousDocs.get(id);

          let before;

          // 🔥 PRIORITY: use cache (REAL OLD VALUE)
          if (cachedBefore) {
            before = deepClone(cachedBefore);
          } else {
            // fallback: build partial old from updated fields
            before = {};
            const updatedFields =
              change.updateDescription?.updatedFields || {};

            Object.keys(updatedFields).forEach((key) => {
              before[key] = "-";
            });
          }

          const updatedFields =
            change.updateDescription?.updatedFields || {};
          const removedFields =
            change.updateDescription?.removedFields || [];

          // 🔥 ensure ALL keys appear (FULL FORM UI SUPPORT)
          const allKeys = new Set([
            ...Object.keys(before || {}),
            ...Object.keys(after || {}),
            ...Object.keys(updatedFields || {}),
          ]);

          let finalBefore = {};
          let finalAfter = {};

          allKeys.forEach((key) => {
            finalBefore[key] =
              before[key] !== undefined ? before[key] : "-";

            finalAfter[key] =
              after[key] !== undefined ? after[key] : "-";
          });

          details = {
            before: finalBefore,
            after: finalAfter,
            updatedFields,
            removedFields,
          };

          // 🔥 update cache
          previousDocs.set(id, after);
        }

        /* ================= DELETE ================= */
        else if (operationType === "delete") {
          action = "delete";

          const before = previousDocs.get(id) || null;

          if (!before) return; // skip bulk deletes

          details = {
            before,
            after: null,
            updatedFields: {},
            removedFields: [],
          };

          previousDocs.delete(id);
        } else {
          return;
        }

        const message = buildMessage(
          collectionName,
          action,
          eventType
        );

        await Notification.create({
          collection: collectionName,
          action,
          message,
          details,
          eventType,
        });

        console.log(
          `[NOTIFICATION] ${collectionName.toUpperCase()} → ${operationType.toUpperCase()}`
        );
      } catch (err) {
        console.error("[WATCHER ERROR]", err.message);
      }
    });

    changeStream.on("error", (err) => {
      console.error("[WATCHER STREAM ERROR]", err.message);
    });

    console.log("[WATCHER] Monitoring ALL collections ✔");
  } catch (error) {
    console.error("[WATCHER INIT ERROR]", error.message);
  }
};

module.exports = startWatcher;