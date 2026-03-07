type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProfessionalDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Professional: {id}</h1>
    </main>
  );
}