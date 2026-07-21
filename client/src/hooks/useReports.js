import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";


const useReports = () => {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= CREATE REPORT ================= */

  const submitReport = async (data) => {

    try {

      setLoading(true);

      const res = await axios.post(
        `${API}/api/reports`,
        data
      );

      if (res.data.success) {
        toast.success("Report submitted successfully", { duration: 3000 });
      }

      return res.data;

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Server error",
        { duration: 3000 }
      );

      return { success: false };

    } finally {
      setLoading(false);
    }

  };

  /* ================= FETCH REPORTS ================= */

  const fetchReports = async (email) => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/api/reports/${email}`
      );

      if (res.data.success) {
        setReports(res.data.reports);
      }

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Server error",
        { duration: 3000 }
      );

    } finally {
      setLoading(false);
    }

  };

  return {
    submitReport,
    fetchReports,
    reports,
    loading
  };

};

export default useReports;