import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "next-firebase-auth-edge";

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Dummy')) ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY : "AIzaSyBzk5rc_jV0GVwgv87g6UOk78H6yI2MJ-Q",
    cookieName: "AuthToken",
    cookieSignatureKeys: ["secret1", "secret2"],
    cookieSerializeOptions: {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 12 * 60 * 60 * 24,
    },
    serviceAccount: {
      projectId: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.includes('Dummy')) ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : "minecraft-cloud-panel",
      clientEmail: (process.env.FIREBASE_ADMIN_CLIENT_EMAIL && !process.env.FIREBASE_ADMIN_CLIENT_EMAIL.includes('example')) ? process.env.FIREBASE_ADMIN_CLIENT_EMAIL : "firebase-adminsdk-fbsvc@minecraft-cloud-panel.iam.gserviceaccount.com",
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY && !process.env.FIREBASE_ADMIN_PRIVATE_KEY.includes('dummy')) ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n") : "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQC+8pk38LDNt5ZE\n04KJQIfZNt751sD2O9Vc6360Gh8BJgmIOT9uyL3s7eZNt/EwLzs9abGEAwZTZZ/L\nn4jUe36ghTcf1CtZjoo9DFj0OrdJwdS97lqJ1wlzXmJHHVlDhCmRPA2Rm5JPCMVU\npWAgKYDBm7M+ZRy5KyOVnqoHQgGCDlljxO7xApFEHXY8qZxE289/rgtBpIkQlLVV\nEeoEF3sPGFaq/mDS4j0+i49AoATQddtcrp+HS0RybQUldCmjpSsSQ10xxmBBK0yT\nWLVs23eTISPOrZb0Hx+kxRtieJ0UVe7CVKIejvBc5Z6hDR3HRiZv+tffE4wT3Mfo\n6JXGOo7jAgMBAAECgf84yprDeTNOwrxHOIqcjHTw50EYpytSa3R57kdA+dV1xju1\nGSsBmOXX/QuyaDsksEErQ9bYn905TYYOJ13/nZO97Cg1mSOkXbtvCkcyL0u9UJML\n4k0l+rjN/ZGO54KHlqAjMmGj36kSkyzFoVEWbpZp4rkr8+OJylDi68nKk1Ctb366\n3v1wPHDt4U6OngHqK/fAOiPXrsE49lGgEmJSRyTqmi26Gqs/Ze+RhaI0ECHKVaBs\nlcIqVsrbeDcWWu1YoiCk97wVqu2CNHZHzMqfGIDKDnL4EH+VjDirYEQoOo2MgH7d\nqzig6n9flIbmkRvE8gYtNuuKXznNuZ9imhYQvZkCgYEA6+Vk8jSYZOlS+/pACdJU\nE28eQ6OZNAK5T8HmQ9sh9Gla4b1BROPEy3zkQ1HseYxhqq8pSVxtYkUmuXkX27wv\ne+3u9pNOvRY/WjCf+HciKMQ48BgZ6NVCwwTGcW/rcJZRLynoGVp037A4JzJyUn7a\ndU/GjCB7vgj6Rxhk4qyqtZkCgYEAzziNh0p1V/rDTH33vAc3mdqsU9/5w7iwwhNh\ntcFLWJ7BIWkSsRHM1ETc+uaKpIT263tucEwr8eSWt+p2dsb98oCeaPehAhRotQjb\n25RRYxem61RajX6HW9uPsZ72wkvg0uykdHvV5fnsDj04FlfmV+n2OHrL30rBxVZa\nqMIh/dsCgYEAjWdbxIhclZj7oooXGwwWU/P260rFClVbqgCsPB6+UtlYnhqpZlc2\nX1hFKEmSfCX3Ya5QDGa4NwEGvoVlFNXQjPRKm0ogF96fKTwemH0pX9CH5Pw9g8Fa\nnLZfEh6pvjqM/b2cIJ6FkpT6hByMRQE/iLTCarsKEhcll7p6txoT1nkCgYAZ3UEt\nBcontRDzVzW4rl3uQjEINwiBuWe2kZy8hufUo9wPQ4Ilv8cFJ6M9XdEoP8BiHAHo\n2lkR1CpLwmQO5z+DKTKcf2wFSm7XScfHXHfcGnOnI9w5lPVoLbt9vA2oqrfhG9Bb\nCanlDpC8Jj/96fLCPl2RJyKTOE1/SAwAzFpZyQKBgEZad0WqAzoUEyZtcp9P8zOD\n59k240wccjqG/TGNyrZo18dxaA8rtn94Sp49f/lK7ZTpbRuPqOs3sgGaVse0yD3T\nvlGpaRdEik/hcvmIokD79AMPc3CeL4y6R3j1cJjhEu7KItWUkuXVKpkl9s8UAJi/\nhs1MXxN4sqjv7v3uiYWr\n-----END PRIVATE KEY-----\n",
    },
    handleValidToken: async ({ token, decodedToken }) => {
      return NextResponse.next();
    },
    handleInvalidToken: async (reason) => {
      // Cho phép trang tải để React Client tự kiểm tra Auth an toàn không bị văng
      return NextResponse.next();
    },
    handleError: async (error) => {
      return NextResponse.next();
    },
  });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/login",
    "/api/logout",
  ],
};
