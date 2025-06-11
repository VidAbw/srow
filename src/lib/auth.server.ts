import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
import { firebaseAdmin } from "./firebaseAdmin";
import { isAdmin } from "./auth.client";

// Protect admin routes
export const protectAdminRoute = async (context: GetServerSidePropsContext) => {
  try {
    // Get auth cookies
    const cookies = nookies.get(context);
    const token = cookies.token;
    if (!token) {
      // Redirect to login if no token
      return {
        redirect: {
          destination: "/login?redirect=/admin",
          permanent: false,
        },
      };
    }
    // Verify token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    // Check if user is admin
    const adminStatus = await isAdmin(uid);
    if (!adminStatus) {
      // Redirect to home if not admin
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    // Allow access to admin page
    return {
      props: {
        uid,
      },
    };
  } catch (error) {
    console.error("Admin route protection error:", error);
    // Redirect to login on error
    return {
      redirect: {
        destination: "/login?redirect=/admin",
        permanent: false,
      },
    };
  }
}; 