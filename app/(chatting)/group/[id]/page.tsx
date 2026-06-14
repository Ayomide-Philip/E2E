"use client";
import { useParams } from "next/navigation";
export default function Page() {
  const { id } = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Group ID: {id}</h1>
      <p className="text-lg text-gray-600">
        This is the group page for the room with ID: {id}. You can implement
        your chat functionality here.
      </p>
    </div>
  );
}
