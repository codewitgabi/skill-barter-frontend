import {ReactNode} from "react";
import {AppNavbar} from "@/components/navbar";

function Layout({ children }: { children: ReactNode }) {
    return <>
        <AppNavbar />
        {children}
    </>
}


export default Layout;
