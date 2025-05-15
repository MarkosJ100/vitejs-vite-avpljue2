import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DollarSign, CreditCard, Fuel, Wrench, ArrowLeft } from 'lucide-react';

const ControlDiario = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    efectivo: '',
    tarjeta: '',
    gasolina: '',
    mantenimiento: '',
    kilometros_actuales: '',
    mantenimiento_detalles: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.fecha || !formData.kilometros_actuales) {
      toast.error('Fecha y Kilómetros Actuales son campos obligatorios');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('control_diario')
        .insert([
          {
            ...formData,
            efectivo: Number(formData.efectivo) || 0,
            tarjeta: Number(formData.tarjeta) || 0,
            gasolina: Number(formData.gasolina) || 0,
            mantenimiento: Number(formData.mantenimiento) || 0,
            kilometros_actuales: Number(formData.kilometros_actuales) || null,
            user_id: session.user.id
          }
        ]);

      if (error) throw error;

      toast.success('Control diario guardado correctamente');
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        efectivo: '',
        tarjeta: '',
        gasolina: '',
        mantenimiento: '',
        kilometros_actuales: '',
        mantenimiento_detalles: ''
      });
    } catch (error: any) {
      toast.error('Error al guardar el control diario');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => { navigate('/'); }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Control Diario</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Control Diario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    name="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kilometros_actuales">Kilómetros Actuales</Label>
                  <Input
                    id="kilometros_actuales"
                    name="kilometros_actuales"
                    type="number"
                    placeholder="0"
                    value={formData.kilometros_actuales}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="efectivo" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Efectivo
                  </Label>
                  <Input
                    id="efectivo"
                    name="efectivo"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.efectivo}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tarjeta" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Total Tarjeta
                  </Label>
                  <Input
                    id="tarjeta"
                    name="tarjeta"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.tarjeta}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gasolina" className="flex items-center gap-2">
                    <Fuel className="h-4 w-4" />
                    Gasolina
                  </Label>
                  <Input
                    id="gasolina"
                    name="gasolina"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.gasolina}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mantenimiento" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Mantenimiento
                  </Label>
                  <Input
                    id="mantenimiento"
                    name="mantenimiento"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.mantenimiento}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mantenimiento_detalles" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Detalles de Mantenimiento
                </Label>
                <Textarea
                  id="mantenimiento_detalles"
                  name="mantenimiento_detalles"
                  placeholder="Describa los detalles del mantenimiento realizado..."
                  value={formData.mantenimiento_detalles}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Control Diario'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default ControlDiario;