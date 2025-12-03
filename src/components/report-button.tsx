import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Link from "next/link"

const ReportButton = ({ slug }: { slug: string }) => {
  return (
    <Button variant="outline" className="hover:cursor-pointer" asChild>
      <Link href={`/courses/${slug}/reports`}>
        <Download /> Relatórios
      </Link>
    </Button>
  )
}

export default ReportButton