import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            toast({
                title: 'Login Successful',
                description: 'Welcome back to Kat Forever Admin',
            });
            navigate('/dashboard');
        } else {
            toast({
                title: 'Login Failed',
                description: result.error,
                variant: 'destructive',
            });
        }

        setLoading(false);
    };

    return (
        // UI Change: Minimal Luxury Neutral Warm Background
        <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4">
            
            {/* UI Change: Sharp box corners (rounded-none), zero heavy shadows, compact grid match */}
            <Card className="w-full max-w-md border border-neutral-200/60 rounded-none bg-white shadow-sm overflow-hidden">
                
                {/* UI Change: Elegant typography line-heights and tight spacing */}
                <CardHeader className="space-y-2 pt-8 pb-4 px-6 sm:px-8 text-center">
                    <div className="flex items-center justify-center mb-2">
                        {/* UI Change: Premium typographic text logo replacing the generic blue box */}
                        <h1 className="text-2xl font-light text-[#2A1416] tracking-[0.25em] uppercase">
                            Kf <span className="font-semibold">Forever</span>
                        </h1>
                    </div>
                    <CardTitle className="text-xl font-serif font-normal text-[#2A1416] tracking-tight">
                        Admin Login
                    </CardTitle>
                    <CardDescription className="text-xs text-[#7a6666] tracking-wide max-w-xs mx-auto">
                        Enter your credentials to access the dashboard
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-6 sm:px-8 pb-8 pt-2">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Email Input Frame */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#8F7A7A]">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@katforever.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                // UI Change: Sharp edges (rounded-none), clean thin border, and luxury brand accent on focus
                                className="block w-full px-4 py-2.5 rounded-none border-neutral-300 focus:border-[#936639] focus:ring-0 focus-visible:ring-0 placeholder:text-neutral-300 text-neutral-800 text-sm h-10 transition-colors"
                            />
                        </div>

                        {/* Password Input Frame */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#8F7A7A]">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                // UI Change: Sharp edges (rounded-none), clean thin border, and luxury brand accent on focus
                                className="block w-full px-4 py-2.5 rounded-none border-neutral-300 focus:border-[#936639] focus:ring-0 focus-visible:ring-0 placeholder:text-neutral-300 text-neutral-800 text-sm h-10 transition-colors"
                            />
                        </div>

                        {/* Submit Button Block */}
                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                // UI Change: Converted to sharp solid brown-gold commercial luxury accent button (#936639)
                                className="w-full flex items-center justify-center gap-2 rounded-none bg-[#936639] hover:bg-[#76502b] text-white font-bold text-xs uppercase tracking-[0.2em] h-11 shadow-none transition-all duration-300 disabled:opacity-70" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        <span>Login</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* UI Change: Demo Account Panel integrated inside a clean luxury bottom plate */}
                    <div className="mt-6 text-center text-xs text-[#7a6666] bg-[#fdfaf5] p-3 border-t border-neutral-100/70 -mx-6 sm:-mx-8 -mb-8">
                        <span className="font-semibold text-gray-700">Demo:</span> admin@katforever.com / admin123
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}