import { AlertTriangle, Lock, Mail, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function BlockedPlatform() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Plataforma Temporariamente Indisponível
          </h1>
        </div>

        <Card className="border-red-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-700 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Acesso Bloqueado
            </CardTitle>
            <CardDescription className="text-base">
              Esta plataforma está temporariamente indisponível devido a
              questões pendentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Atenção:</strong> O acesso a esta plataforma foi
                suspenso devido à falta de acordo comercial entre as partes
                envolvidas no desenvolvimento e implementação do sistema.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900">Situação Atual:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Tentativas de negociação para pagamento dos serviços prestados
                  foram realizadas
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  A empresa optou por não prosseguir com as negociações
                  comerciais
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Como medida de proteção, o acesso foi temporariamente suspenso
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Resolução:</h3>
              <p className="text-sm text-blue-800 mb-3">
                Esta situação pode ser resolvida através de negociação direta
                entre as partes. O acesso será restaurado assim que um acordo
                comercial justo for estabelecido.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Mail className="w-4 h-4" />
                  Contato por E-mail
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Phone className="w-4 h-4" />
                  Contato Telefônico
                </Button>
              </div>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">
                Esta mensagem é exibida para proteger os direitos do
                desenvolvedor da plataforma.
                <br />
                Todos os dados e funcionalidades permanecem seguros e serão
                restaurados mediante acordo.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Para questões legais ou esclarecimentos adicionais, entre em contato
            através dos canais oficiais.
          </p>
        </div>
      </div>
    </div>
  );
}
