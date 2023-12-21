export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <body className="min-h-screen min-w-screen max-w-screen">
      <main>{children}</main>
    </body>
  );
};
