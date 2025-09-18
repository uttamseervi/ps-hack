export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 animate-pulse mx-auto">
          <div className="w-6 h-6 bg-primary-foreground rounded" />
        </div>
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  )
}
