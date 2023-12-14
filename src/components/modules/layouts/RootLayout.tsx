export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <body className="min-h-full min-w-full">
      <main className="max-w-4xl mx-auto">{children}</main>
    </body>
  );
};
