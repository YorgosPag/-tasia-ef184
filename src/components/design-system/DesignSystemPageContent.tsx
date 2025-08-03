'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Settings, 
  Download, 
  Upload,
  Eye,
  Paintbrush,
  Sparkles
} from 'lucide-react';

// Simple implementations of missing UI components
const Tabs = ({ value, onValueChange, className = "", children }) => (
  <div className={className}>{children}</div>
);

const TabsList = ({ className = "", children }) => (
  <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>
    {children}
  </div>
);

const TabsTrigger = ({ value, className = "", children, onClick }) => {
  const isActive = false; // You'd implement active state logic here
  return (
    <button
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive ? 'bg-white shadow-sm' : 'hover:bg-white/60'
      } ${className}`}
      onClick={() => onClick?.(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className = "", children }) => (
  <div className={`mt-4 ${className}`}>{children}</div>
);

const Card = ({ className = "", children }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Badge = ({ variant = "default", className = "", children }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700"
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ variant = "default", size = "default", className = "", children, onClick, ...props }) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-4 py-2"
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Color Customizer component
const ColorCustomizer = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Κύρια Χρώματα
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Primary Color</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded border"></div>
              <input type="color" defaultValue="#2563eb" className="w-8 h-8 rounded border" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Secondary Color</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-600 rounded border"></div>
              <input type="color" defaultValue="#4b5563" className="w-8 h-8 rounded border" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Accent Color</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded border"></div>
              <input type="color" defaultValue="#059669" className="w-8 h-8 rounded border" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Color Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-600 text-white rounded">
            <h4 className="font-semibold">Primary Color</h4>
            <p className="text-sm opacity-90">This is how primary color looks</p>
          </div>
          <div className="p-4 bg-gray-600 text-white rounded">
            <h4 className="font-semibold">Secondary Color</h4>
            <p className="text-sm opacity-90">This is how secondary color looks</p>
          </div>
          <div className="p-4 bg-green-600 text-white rounded">
            <h4 className="font-semibold">Accent Color</h4>
            <p className="text-sm opacity-90">This is how accent color looks</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Simple Typography Customizer component
const TypographyCustomizer = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          Γραμματοσειρές
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Heading Font</label>
            <select className="w-full px-3 py-2 border rounded-md">
              <option>Inter</option>
              <option>Roboto</option>
              <option>Open Sans</option>
              <option>Lato</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Body Font</label>
            <select className="w-full px-3 py-2 border rounded-md">
              <option>Inter</option>
              <option>Roboto</option>
              <option>Open Sans</option>
              <option>Lato</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Font Size Scale</label>
            <input type="range" min="0.8" max="1.2" step="0.1" defaultValue="1" className="w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Typography Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Heading 1</h1>
          <h2 className="text-2xl font-semibold">Heading 2</h2>
          <h3 className="text-xl font-medium">Heading 3</h3>
          <p className="text-base">This is a paragraph with regular text. It shows how the body font looks in normal content.</p>
          <p className="text-sm text-gray-600">This is smaller text, often used for captions or secondary information.</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Simple Spacing Customizer component
const SpacingCustomizer = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Διαστάσεις & Αποστάσεις
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Base Spacing Unit</label>
            <input type="range" min="2" max="8" step="1" defaultValue="4" className="w-full" />
            <div className="text-xs text-gray-500 mt-1">Current: 4px (1rem = 16px)</div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Border Radius</label>
            <input type="range" min="0" max="16" step="1" defaultValue="6" className="w-full" />
            <div className="text-xs text-gray-500 mt-1">Current: 6px</div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Container Max Width</label>
            <select className="w-full px-3 py-2 border rounded-md">
              <option>1200px</option>
              <option>1400px</option>
              <option>1600px</option>
              <option>Full Width</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Spacing Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-100 rounded-md">
            <div className="text-sm font-medium mb-2">Small Spacing (p-2)</div>
            <div className="p-2 bg-white rounded">Content with small padding</div>
          </div>
          <div className="p-6 bg-green-100 rounded-md">
            <div className="text-sm font-medium mb-2">Medium Spacing (p-4)</div>
            <div className="p-4 bg-white rounded">Content with medium padding</div>
          </div>
          <div className="p-8 bg-purple-100 rounded-md">
            <div className="text-sm font-medium mb-2">Large Spacing (p-6)</div>
            <div className="p-6 bg-white rounded">Content with large padding</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function DesignSystemPageContent() {
  const [activeTab, setActiveTab] = useState('colors');

  const exportAllSettings = () => {
    console.log('Exporting complete theme...');
    alert('Theme export functionality would be implemented here');
  };

  const importSettings = () => {
    console.log('Importing theme...');
    alert('Theme import functionality would be implemented here');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 p-4 gap-4 min-h-screen">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40 rounded-lg">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-blue-600" />
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
            <TabsTrigger value="colors" onClick={() => setActiveTab('colors')} className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Χρώματα
            </TabsTrigger>
            <TabsTrigger value="typography" onClick={() => setActiveTab('typography')} className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Γραμματοσειρές
            </TabsTrigger>
            <TabsTrigger value="spacing" onClick={() => setActiveTab('spacing')} className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Διαστάσεις
            </TabsTrigger>
            <TabsTrigger value="components" onClick={() => setActiveTab('components')} className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="themes" onClick={() => setActiveTab('themes')} className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Themes
            </TabsTrigger>
          </TabsList>

          {activeTab === 'colors' && (
            <TabsContent value="colors" className="space-y-6">
              <ColorCustomizer />
            </TabsContent>
          )}

          {activeTab === 'typography' && (
            <TabsContent value="typography" className="space-y-6">
              <TypographyCustomizer />
            </TabsContent>
          )}

          {activeTab === 'spacing' && (
            <TabsContent value="spacing" className="space-y-6">
              <SpacingCustomizer />
            </TabsContent>
          )}

          {activeTab === 'components' && (
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
                    <div className="text-sm text-gray-600">
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
                          <div className="text-xs text-gray-500">
                            Customize button colors, sizes, and border radius
                          </div>
                        </div>
                      </div>

                      {/* Card Styles */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Card Styles</h4>
                        <Card className="p-3">
                          <h5 className="text-sm font-semibold mb-1">Sample Card</h5>
                          <p className="text-xs text-gray-600">
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
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <select className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                    <div className="text-sm text-gray-600">
                      See how your component changes look in context
                    </div>
                    
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Sample Form</h4>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Name</label>
                          <input 
                            type="text" 
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Category</label>
                          <select className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
          )}

          {activeTab === 'themes' && (
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
                          <p className="text-xs text-gray-600">
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
                          <p className="text-xs text-gray-600">
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
                          <p className="text-xs text-gray-600">
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
                      <Button className="w-full" size="sm" onClick={importSettings}>
                        <Upload className="w-4 h-4 mr-2" />
                        Import Theme
                      </Button>
                      <Button variant="outline" className="w-full" size="sm" onClick={exportAllSettings}>
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
          )}
        </Tabs>
      </div>
    </div>
  );
}