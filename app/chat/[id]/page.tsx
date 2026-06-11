export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Chat Page {id}</h1>
    </div>
  );
}
