import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
import { firebaseAdmin } from "./firebaseAdmin";

const checkIsAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userDoc = await firebaseAdmin.firestore().collection("users").doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData?.role === "admin";
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status on server:", error);
    return false;
  }
};

// Protect admin routes
export const protectAdminRoute = async (context: GetServerSidePropsContext) => {
  try {
    // Get auth cookies
    const cookies = nookies.get(context);
    const token = cookies.admin_token;
    if (!token) {
      // Redirect to admin login if no token
      return {
        redirect: {
          destination: `/admin/login?redirect=${context.resolvedUrl}`,
          permanent: false,
        },
      };
    }
    // Verify token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    // Check if user is admin
    const adminStatus = await checkIsAdmin(uid);
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
    // Redirect to admin login on error
    return {
      redirect: {
        destination: `/admin/login?redirect=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }
}; 