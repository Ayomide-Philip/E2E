export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const socket = new WebSocket("ws://localhost:3000/api/ws");
  socket.onopen = () => {
    socket.send(JSON.stringify({ message: "Hello, server!", type: "message" }));
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Chat Page {id}</h1>
    </div>
  );
}
