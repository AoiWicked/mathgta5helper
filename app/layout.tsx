export const metadata = {
    title: "2×2 Finder",
    description: "Drop image/txt → find 2×2 sum",
};
import "./globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div className="container">{children}</div>
            </body>
        </html>
    );
}
