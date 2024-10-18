import { Building } from '@/components/Building'

export default function Page({ params }: { params: { id: string } }) {
  return <Building id={params.id} />
}
