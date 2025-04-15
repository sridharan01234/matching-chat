import ChatWindow from "@/components/ChatWindow";

export default async function ChatPage({ params }: { params: { chatId: string } }) {
  // Await the dynamic params before using
  const { chatId } = await params;
  return <ChatWindow chatId={chatId} />;
}
