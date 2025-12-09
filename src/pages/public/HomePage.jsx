import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to Modern CMS
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A powerful, flexible content management system built with modern web technologies.
              Create, manage, and publish your content with ease.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Easy Content Editing"
              description="Intuitive rich text editor with drag-and-drop modules for building beautiful pages"
            />
            <FeatureCard
              title="Media Management"
              description="Organize and optimize your images and files with our powerful media library"
            />
            <FeatureCard
              title="SEO Optimized"
              description="Built-in SEO tools to help your content rank better in search engines"
            />
            <FeatureCard
              title="Responsive Design"
              description="Your content looks great on all devices, from mobile to desktop"
            />
            <FeatureCard
              title="User Roles"
              description="Manage team access with customizable user roles and permissions"
            />
            <FeatureCard
              title="Preview & Publish"
              description="Preview your changes before publishing and schedule content for later"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users who trust Modern CMS for their content management needs
          </p>
          <Button size="lg" variant="secondary">
            Start Free Trial
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description }) {
  return (
    <div className="p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
