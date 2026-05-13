import { NextRequest, NextResponse } from "next/server";
import { UserRoleEnum } from "./enums/user.enum";

const publicRoutes = ['/public', '/login', '/signup'];
const authBlockRoutes = ['/login', '/signup'];

const userRoutes = ['/user'];
const creatorRoutes = ['/creator'];

export default function proxy(req: NextRequest) {
    const credentials = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;
    const pathname = req.nextUrl.pathname;

    const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`) || pathname.endsWith('.svg'));
    const isAuthBlock = authBlockRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    const isAuthenticated = Boolean(credentials);

    if (isAuthenticated && isAuthBlock) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    if (isPublic) {
        return NextResponse.next();
    }
    if (!isAuthenticated && !isPublic) {
        return NextResponse.redirect(new URL("/signup", req.url));
    }

    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
    const isCreatorRoute = creatorRoutes.some(route => pathname.startsWith(route));

    if (role === UserRoleEnum.USER && isCreatorRoute) {
        return NextResponse.redirect(new URL("/user/profile", req.url));
    }

    if (role === UserRoleEnum.CREATOR && isUserRoute) {
        return NextResponse.redirect(new URL("/creator/insight", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};