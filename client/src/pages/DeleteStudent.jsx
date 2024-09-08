import { redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export async function action({ params }) {
  try {
    console.log(params, 33333333333);
    await customFetch.delete(`/students/${params.id}`);
    toast.success("Student deleted successfully");
  } catch (error) {
    console.log(params, 3223123);
    toast.error(error.response.data.msg);
  }
  return redirect("/dashboard");
}
