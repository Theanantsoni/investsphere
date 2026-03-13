import { useState } from "react";
import {
  createReport,
  getReportsByEmail
} from "../services/reportService";

/* ======================================================
   USE REPORTS HOOK
====================================================== */

const useReports = () => {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ======================================================
     SUBMIT REPORT
  ====================================================== */

  const submitReport = async ({
    title,
    description,
    userEmail,
    userName
  }) => {

    setLoading(true);

    const response = await createReport({
      title,
      description,
      userEmail,
      userName
    });

    setLoading(false);

    return response;
  };

  /* ======================================================
     FETCH REPORTS
  ====================================================== */

  const fetchReports = async (email) => {

    setLoading(true);

    const response = await getReportsByEmail(email);

    if (response.success) {
      setReports(response.reports);
    }

    setLoading(false);

    return response;
  };

  return {
    reports,
    loading,
    submitReport,
    fetchReports
  };
};

export default useReports;