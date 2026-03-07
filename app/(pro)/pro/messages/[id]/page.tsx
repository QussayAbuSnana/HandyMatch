type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProChatPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Conversation with {id}</h1>
    </main>
  );
}