import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";
import { redirectToSignIn } from "@clerk/nextjs/server";

export default authMiddleware({
  // publicRoutes: (req) => !req.url.includes("/dashboard"),
  afterAuth(auth, req): NextResponse | Promise<void> {
    // optional 3rd arg called evt
    // console.log("middleware running");
    console.log(auth?.userId);
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // Redirect signed in users to organization selection page if they are not active in an organization
    // if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/") {
    //   const orgSelection = new URL("/", req.url);
    //   return NextResponse.redirect(orgSelection);
    // }
    // If the user is signed in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }
    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
