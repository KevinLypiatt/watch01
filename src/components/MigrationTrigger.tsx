import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export const MigrationTrigger = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleMigration = async () => {
    setIsLoading(true)
    try {
      console.log('Calling migrate-references function...')
      const { data, error } = await supabase.functions.invoke('migrate-references', {
        method: 'POST',
      })
      
      console.log('Response:', data, error)
      
      if (error) {
        throw new Error(error.message || 'Failed to call migration function')
      }
      
      if (!data?.success) {
        throw new Error(data?.error || 'Migration failed')
      }
      
      toast({
        title: "Success",
        description: `Migration completed. ${data.count} references were processed.`,
      })
    } catch (error) {
      console.error('Migration error:', error)
      toast({
        title: "Migration Failed",
        description: error.message || "Failed to migrate references",
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