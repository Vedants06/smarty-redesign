import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            

            
            <span className="text-lg font-bold text-foreground">Smarty</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Premium tech education for the next generation of engineers.
          </p>
        </div>
        {[
        { title: "Platform", links: ["Courses", "Learning Paths", "Pricing", "For Teams"] },
        { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
        { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] }].
        map((col) =>
        <div key={col.title}>
            <h4 className="font-semibold text-foreground text-sm mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) =>
            <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
                </li>
            )}
            </ul>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © 2025 Smarty. All rights reserved.
      </div>
    </footer>);

}