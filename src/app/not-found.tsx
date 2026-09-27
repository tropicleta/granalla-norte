import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="font-display text-6xl font-semibold text-khaki-700">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-olive-900">No encontramos esta página</h1>
      <div className="mt-8"><ButtonLink href="/">Volver al inicio</ButtonLink></div>
    </Container>
  );
}
