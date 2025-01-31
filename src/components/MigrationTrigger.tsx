import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export const MigrationTrigger = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleMigration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        'https://jemkiomfmxtintrfeiyf.supabase.co/functions/v1/migrate-references',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      toast({
        title: "Success",
        description: `Migration completed. ${data.count} references were processed.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleMigration}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Migrate Watch References"}
    </Button>
  )
}