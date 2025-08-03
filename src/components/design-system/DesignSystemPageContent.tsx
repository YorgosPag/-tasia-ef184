'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Palette, 
  Type, 
  Layout, 
  Settings, 
  Download, 
  Upload,
  Eye,
  Paintbrush,
  Rulers,
  Sparkles
} from 'lucide-react';
import { ColorCustomizer } from './ColorCustomizer';
import { TypographyCustomizer } from './TypographyCustomizer';
import { SpacingCustomizer } from './SpacingCustomizer';

export function DesignSystemPageContent() {
  const [activeTab, setActiveTab] = useState('colors');

  const exportAllSettings = () => {
    // This would export all customizations as a complete theme
    console.log('Exporting complete theme...');
  };

  const importSettings = () => {
    // This would import theme settings
    console.log('Importing theme...');
  };

  return (
    <div className="h-full flex flex-col bg-background p-4 gap-4">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold">Design System</h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                Customization & Theming
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={importSettings}>
                <Upload className="w-4 h-4 mr-2" />
                Import Theme
              </Button>
              <Button variant="outline" size="sm" onClick={exportAllSettings}>
                <Download className="w-4 h-4 mr-2" />
                Export Theme
              </Button>
              <Button size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Χρώματα
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Γραμματοσειρές
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-2">
              <Rulers className="w-4 h-4" />
              Διαστάσεις
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Themes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
            <ColorCustomizer />
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <TypographyCustomizer />
          </TabsContent>

          <TabsContent value="spacing" className="space-y-6">
            <SpacingCustomizer />
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Component Customization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    Component Styles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Customize button styles, card appearances, form elements and more.
                  </div>
                  
                  <div className="space-y-4">
                    {/* Button Styles */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Button Styles</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Button size="sm">Primary</Button>
                          <Button variant="secondary" size="sm">Secondary</Button>
                          <Button variant="outline" size="sm">Outline</Button>
                          <Button variant="ghost" size="sm">Ghost</Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Customize button colors, sizes, and border radius
                        </div>
                      </div>
                    </div>

                    {/* Card Styles */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Card Styles</h4>
                      <Card className="p-3">
                        <h5 className="text-sm font-semibold mb-1">Sample Card</h5>
                        <p className="text-xs text-muted-foreground">
                          Customize card shadows, borders, and spacing
                        </p>
                      </Card>
                    </div>

                    {/* Form Elements */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Form Elements</h4>
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          placeholder="Input field"
                          className="w-full px-3 py-2 text-sm border rounded-md"
                        />
                        <select className="w-full px-3 py-2 text-sm border rounded-md">
                          <option>Select option</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Component Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Component Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    See how your component changes look in context
                  </div>
                  
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Sample Form</h4>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Name</label>
                        <input 
                          type="text" 
                          placeholder="Enter your name"
                          className="w-full px-3 py-2 text-sm border rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Category</label>
                        <select className="w-full px-3 py-2 text-sm border rounded-md">
                          <option>Select category</option>
                          <option>Option 1</option>
                          <option>Option 2</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm">Submit</Button>
                        <Button variant="outline" size="sm">Cancel</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="themes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pre-built Themes */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Pre-built Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Default Theme */}
                    <div className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Default</h4>
                          <Badge>Current</Badge>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Clean and modern design with blue accents
                        </p>
                      </div>
                    </div>

                    {/* Dark Theme */}
                    <div className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow bg-gray-900 text-white">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Dark Mode</h4>
                          <Badge variant="outline" className="text-white border-white">Coming Soon</Badge>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                          <div className="w-6 h-6 bg-emerald-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                        </div>
                        <p className="text-xs text-gray-300">
                          Dark theme with purple accents and high contrast
                        </p>
                      </div>
                    </div>

                    {/* Corporate Theme */}
                    <div className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Corporate</h4>
                          <Badge variant="outline">Coming Soon</Badge>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
                          <div className="w-6 h-6 bg-slate-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                          <div className="w-6 h-6 bg-slate-400 rounded-full"></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Professional theme with neutral colors
                        </p>
                      </div>
                    </div>

                    {/* Creative Theme */}
                    <div className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Creative</h4>
                          <Badge variant="outline">Coming Soon</Badge>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-6 h-6 bg-pink-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-cyan-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Vibrant theme with bold colors and gradients
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Theme Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button className="w-full" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Theme
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Current Theme
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Palette className="w-4 h-4 mr-2" />
                      Create Custom Theme
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h5 className="text-sm font-medium mb-2">Quick Actions</h5>
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        Reset to Default
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        Save as Template
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        Share Theme
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
