import CardHorizontal from "@/components/custom/cardHorizontal";
import { routes } from "@/constants/routes";
import { ScrollView, View } from "react-native";

const Index = () => {

  return (
    <ScrollView>
      <View className="mt-4 pb-10">

      <CardHorizontal
        title="Publicar Oferta"
        description="Comparte tu talento y servicios con la comunidad"
        iconName="add-circle"
        href={routes.ofertas.crear}
      />

      <CardHorizontal
        title="Comprar Créditos"
        description="Adquiere créditos y mira la información de tus ofertas"
        iconName="card"
        href={routes.client.buyCredits}
      />

      <CardHorizontal
        // href={routes.client.ofertas.index}
        title="Mis Ofertas"
        description="Revisa y gestiona tus ofertas publicadas en el catálogo"
        iconName="list"
        href={routes.ofertas.misofertas}
      />

      <CardHorizontal
        title="Solicitar Servicio"
        description="Solicita un servicio que no esté en el catálogo"
        iconName="construct"
      />

      <CardHorizontal
        title="Mis solicitudes"
        description="Mira el estado de tus solicitudes de servicios"
        iconName="document-text"
      />

      </View>
    </ScrollView>
  );
};

export default Index;
