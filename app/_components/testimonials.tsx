import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Chen",
    skill: "Learned Web Development",
    avatar: "SC",
    rating: 5,
    quote:
      "I learned React and Next.js in exchange for teaching photography. The community is amazing and everyone is so supportive!",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Marcus Johnson",
    skill: "Taught Music Production",
    avatar: "MJ",
    rating: 5,
    quote:
      "Best platform for skill exchange! I've taught music production to 5 people and learned Spanish in return. Highly recommend!",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Emma Rodriguez",
    skill: "Exchanged Design Skills",
    avatar: "ER",
    rating: 5,
    quote:
      "As a designer, I've connected with so many talented people. The skill bartering concept is brilliant - learning has never been this accessible.",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "David Kim",
    skill: "Learned Cooking",
    avatar: "DK",
    rating: 5,
    quote:
      "I learned authentic Korean cooking while teaching web development. The flexibility and community spirit here is unmatched!",
    color: "from-orange-500 to-red-500",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted-foreground",
          )}
        />
      ))}
    </div>
  );
}

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-20 overflow-hidden scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from members who are building their skills and
              networks
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-background border-2 border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Quote Icon */}
                <div
                  className={cn(
                    "absolute top-4 right-4 w-10 h-10 rounded-lg bg-linear-to-br opacity-10 group-hover:opacity-20 transition-opacity",
                    testimonial.color,
                  )}
                >
                  <Quote className="w-6 h-6 text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Quote */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 relative z-10">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full bg-linear-to-br flex items-center justify-center text-white font-bold text-sm",
                      testimonial.color,
                    )}
                  >
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {testimonial.skill}
                    </p>
                  </div>
                </div>

                {/* Hover Effect */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10 bg-linear-to-br",
                    testimonial.color,
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
