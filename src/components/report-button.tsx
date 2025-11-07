import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const ReportButton = () => {
  return (
    <Button variant="outline" className="hover:cursor-pointer"><Download /> Relatórios</Button>
  )
}

export default ReportButton