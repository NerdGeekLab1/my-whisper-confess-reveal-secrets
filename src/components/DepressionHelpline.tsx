
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Phone, MessageCircle, Users, Clock, Shield, Headphones, Video } from "lucide-react";

interface SupportResource {
  id: number;
  type: "hotline" | "chat" | "therapy" | "group" | "crisis";
  title: string;
  description: string;
  availability: string;
  contact: string;
  isAnonymous: boolean;
  language: string[];
  speciality?: string[];
}

const DepressionHelpline = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isInCrisis, setIsInCrisis] = useState(false);

  const resources: SupportResource[] = [
    {
      id: 1,
      type: "crisis",
      title: "Crisis Support Line",
      description: "Immediate support for those in crisis or having suicidal thoughts",
      availability: "24/7",
      contact: "988",
      isAnonymous: true,
      language: ["English", "Spanish"],
      speciality: ["Suicide Prevention", "Crisis Intervention"]
    },
    {
      id: 2,
      type: "chat",
      title: "Anonymous Chat Support",
      description: "Text-based counseling with trained volunteers",
      availability: "Daily 6 PM - 12 AM",
      contact: "Start Chat",
      isAnonymous: true,
      language: ["English"],
      speciality: ["Depression", "Anxiety", "Relationship Issues"]
    },
    {
      id: 3,
      type: "therapy",
      title: "Professional Therapy Matching",
      description: "Connect with licensed therapists specializing in relationship trauma",
      availability: "By Appointment",
      contact: "Schedule Session",
      isAnonymous: false,
      language: ["English", "Spanish", "French"],
      speciality: ["Relationship Trauma", "Betrayal Recovery", "PTSD"]
    },
    {
      id: 4,
      type: "group",
      title: "Support Groups",
      description: "Join others who understand your experience",
      availability: "Weekly Sessions",
      contact: "Join Group",
      isAnonymous: true,
      language: ["English"],
      speciality: ["Betrayal Recovery", "Trust Issues", "Self-Worth"]
    },
    {
      id: 5,
      type: "hotline",
      title: "Relationship Abuse Hotline",
      description: "Support for those experiencing emotional or physical abuse",
      availability: "24/7",
      contact: "1-800-799-7233",
      isAnonymous: true,
      language: ["English", "Spanish", "200+ languages via interpreter"],
      speciality: ["Domestic Violence", "Emotional Abuse", "Safety Planning"]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "crisis": return <Heart className="w-5 h-5 text-red-400" />;
      case "chat": return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case "therapy": return <Headphones className="w-5 h-5 text-green-400" />;
      case "group": return <Users className="w-5 h-5 text-purple-400" />;
      case "hotline": return <Phone className="w-5 h-5 text-orange-400" />;
      default: return <Heart className="w-5 h-5 text-pink-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "crisis": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "chat": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "therapy": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "group": return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "hotline": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      default: return "bg-pink-500/20 text-pink-400 border-pink-500/50";
    }
  };

  const filteredResources = selectedCategory === "all" 
    ? resources 
    : resources.filter(r => r.type === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-pink-400" />
            Depression & Crisis Helpline
          </h1>
          <p className="text-slate-400">You're not alone. Professional help and support are available 24/7</p>
        </div>

        {/* Crisis Alert */}
        {isInCrisis && (
          <Card className="bg-red-900/50 border-red-500 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Heart className="w-8 h-8 text-red-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Need Immediate Help?</h3>
                  <p className="text-red-200">If you're having thoughts of suicide or self-harm, please reach out now:</p>
                  <div className="flex space-x-4 mt-2">
                    <Button asChild className="bg-red-600 hover:bg-red-700">
                      <a href="tel:988"><Phone className="w-4 h-4 mr-2" />Call 988</a>
                    </Button>
                    <Button asChild variant="outline" className="border-red-500 text-red-200 hover:bg-red-900">
                      <a href="sms:741741&body=HOME"><MessageCircle className="w-4 h-4 mr-2" />Crisis Chat</a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Crisis Toggle */}
        <div className="mb-6">
          <Button
            onClick={() => setIsInCrisis(!isInCrisis)}
            variant={isInCrisis ? "destructive" : "outline"}
            className={isInCrisis ? "" : "border-red-500 text-red-400 hover:bg-red-900"}
          >
            {isInCrisis ? "I'm Safe Now" : "I Need Crisis Help"}
          </Button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Support Categories</h2>
          <div className="flex flex-wrap gap-2">
            {["all", "crisis", "chat", "therapy", "group", "hotline"].map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => setSelectedCategory(category)}
                className={`border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors ${
                  selectedCategory === category ? "bg-slate-700 border-slate-500 text-white" : ""
                }`}
              >
                {category === "all" ? "All Resources" : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(resource.type)}
                    <div>
                      <CardTitle className="text-white text-lg">{resource.title}</CardTitle>
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  {resource.isAnonymous && (
                    <Badge className="bg-green-500/20 text-green-400">
                      <Shield className="w-3 h-3 mr-1" />
                      Anonymous
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">{resource.description}</p>

                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {resource.availability}
                  </span>
                </div>

                {resource.speciality && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {resource.speciality.map((spec) => (
                        <Badge key={spec} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-slate-400 mb-2">Languages: {resource.language.join(", ")}</p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  {(() => {
                    const isPhone = /^\d|\+|-/.test(resource.contact) || resource.contact === "988";
                    const digits = resource.contact.replace(/[^\d+]/g, "");
                    const href = isPhone
                      ? `tel:${digits}`
                      : resource.type === "chat"
                      ? "sms:741741&body=HOME"
                      : resource.type === "therapy"
                      ? "mailto:support@shadow-stories.lovable.app?subject=Therapy%20request"
                      : "#";
                    const label = isPhone ? (
                      <><Phone className="w-4 h-4 mr-2" />Call {resource.contact}</>
                    ) : resource.type === "chat" ? (
                      <><MessageCircle className="w-4 h-4 mr-2" />{resource.contact}</>
                    ) : (
                      resource.contact
                    );
                    return (
                      <Button asChild
                        className={resource.type === "crisis"
                          ? "bg-red-600 hover:bg-red-700 w-full"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full"}>
                        <a href={href} target={isPhone || href.startsWith("mailto") || href.startsWith("sms") ? "_self" : "_blank"} rel="noopener">
                          {label}
                        </a>
                      </Button>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Self-Care Tips */}
        <Card className="bg-slate-900 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Immediate Self-Care Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div>
                <h4 className="font-semibold text-white mb-2">Breathing Exercise</h4>
                <p className="text-sm">Breathe in for 4 counts, hold for 4, exhale for 6. Repeat 5 times.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Grounding Technique</h4>
                <p className="text-sm">Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Stay Connected</h4>
                <p className="text-sm">Reach out to a trusted friend or family member. Connection helps healing.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Remember</h4>
                <p className="text-sm">This pain is temporary. You are stronger than you know, and help is available.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepressionHelpline;
