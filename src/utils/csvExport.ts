import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type TableName = "ai_prompts" | "reference_descriptions" | "watches";

export const exportTableToCSV = async (tableName: TableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      toast({
        title: "No Data",
        description: `No data found in ${tableName} table`,
        variant: "destructive",
      });
      return;
    }

    // Convert data to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] ?? '')
        ).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${tableName}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: `${tableName} exported successfully`,
    });
  } catch (error) {
    console.error(`Error exporting ${tableName}:`, error);
    toast({
      title: "Error",
      description: `Failed to export ${tableName}`,
      variant: "destructive",
    });
  }
};