export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <body className="min-h-full min-w-full">
      <main>{children}</main>
    </body>
  );
};
