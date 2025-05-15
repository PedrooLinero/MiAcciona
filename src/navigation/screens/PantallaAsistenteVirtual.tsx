import React from "react";
import { Box } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Appbar, Button } from "react-native-paper";
import {
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  TextInput,
  Image,
  Text,
  Linking,
  Alert,
} from "react-native";
import logo_acciona from "../../assets/Logo_aplicacion.png";
import pantalla_AsistenteVirtual from "../../assets/iconos/pantalla_asistente_virtual.png";
import punto from "../../assets/iconos/punto.png";
import whatsapp from "../../assets/iconos/whatsapp.png";
import telefono from "../../assets/iconos/telefono.png";
import { Span } from "@expo/html-elements";

type RootStackParamList = {
  Home: undefined;
  AsistenteVirtual: undefined;
};

type AsistenteVirtualScreenProp = StackNavigationProp<
  RootStackParamList,
  "AsistenteVirtual"
>;

function PantallaAsistenteVirtual() {
  const navigation = useNavigation<AsistenteVirtualScreenProp>();
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f9fa" }}>
        <Box style={{ flex: 1 }}>
          {/* Appbar idéntico al de PantallaCombinada */}
          <Appbar.Header style={styles.appbar}>
            <Appbar.Action
              icon="arrow-left"
              color="white"
              onPress={() => navigation.goBack()}
            />
            <Appbar.Content
              title="Asistente virtual"
              titleStyle={styles.title}
              style={{ marginLeft: 0 }}
            />
          </Appbar.Header>

          <ScrollView style={{}}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                margin: 10,
              }}
            >
              <Image
                source={logo_acciona}
                style={{ width: 200, height: 80 }}
                resizeMode="contain"
              ></Image>
            </View>
            <View
              style={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 10,
                marginTop: 10,
              }}
            >
              <View style={{ marginLeft: 10 }}>
                <Text
                  style={{ fontSize: 20, color: "#D50032", fontWeight: 800 }}
                >
                  ASISTENTE VIRTUAL
                </Text>
                <Text style={{ fontSize: 18, color: "#343434" }}>
                  AMPLIAMOS LOS SERVICIOS
                </Text>
                <Text style={{ fontSize: 18, color: "#343434" }}>
                  DE ATENCIÓN AL EMPLEADO
                </Text>
              </View>
              <View>
                <Image
                  source={pantalla_AsistenteVirtual}
                  style={{ width: 100, height: 80 }}
                  resizeMode="contain"
                ></Image>
              </View>
            </View>
            <View style={{ margin: 20 }}>
              <Text
                style={{
                  fontSize: 17,
                  color: "#595958",
                  fontWeight: 600,
                  marginBottom: 15,
                }}
              >
                Ahora puedes realizar más trámites con este servicio de atención
                al empleado. ¡Estamos para ayudarte!
              </Text>
              <Text
                style={{ fontSize: 17, color: "#595958", marginBottom: 15 }}
              >
                Te recordamos que el{" "}
                <Span style={{ fontWeight: 600 }}>asistente virtual</Span> es un
                servicio de atención al empleado al que{" "}
                <Span style={{ fontWeight: 600 }}>
                  podrás dirigirte y donde daremos solución
                </Span>{" "}
                a solicitudes, incidencias y envío de documentación con los{" "}
                <Span style={{ fontWeight: 600 }}>trámites</Span> relacionados
                con el departamento de{" "}
                <Span style={{ fontWeight: 600 }}>
                  Administración de Recursos Humanos
                </Span>
                .
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  color: "#595958",
                  marginBottom: 5,
                  fontWeight: 600,
                }}
              >
                SERVICIOS DE ATENCIÓN AL EMPLEADO
              </Text>

              <Text
                style={{
                  fontSize: 17,
                  color: "#595958",
                  marginBottom: 15,
                }}
              >
                A partir de ahora puedes gestionar más trámites a través de
                WhatsApp con el departamento de Administración de Recursos
                Humanos:
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: "#595958",
                  marginBottom: 15,
                }}
              >
                Estos son los servicios disponibles:
              </Text>
              <View style={{ paddingLeft: 20, marginBottom: 15 }}>
                <View
                  style={{
                    marginBottom: 5,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Image source={punto} style={{ width: 5, height: 5 }}></Image>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#595958",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    Consulta y solicitud de nóminas.
                  </Text>
                </View>
                <View
                  style={{
                    marginBottom: 5,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Image source={punto} style={{ width: 5, height: 5 }}></Image>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#595958",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    Solicitud de contrato de trabajo y/o soporte para la firma.
                  </Text>
                </View>
                <View
                  style={{
                    marginBottom: 5,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Image source={punto} style={{ width: 5, height: 5 }}></Image>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#595958",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    Cambio de datos personales: domicilio, correo electrónico,
                    NIE, DNI…{" "}
                    <Span style={{ fontWeight: 800, color: "#D50032" }}>
                      *NUEVO
                    </Span>
                  </Text>
                </View>
                <View
                  style={{
                    marginBottom: 5,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Image source={punto} style={{ width: 5, height: 5 }}></Image>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#595958",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    Cambio de cuenta bancaria{" "}
                    <Span style={{ fontWeight: 800, color: "#D50032" }}>
                      *NUEVO
                    </Span>
                  </Text>
                </View>
                <View
                  style={{
                    marginBottom: 5,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Image source={punto} style={{ width: 5, height: 5 }}></Image>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#595958",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    IRPF pactado{" "}
                    <Span style={{ fontWeight: 800, color: "#D50032" }}>
                      *NUEVO
                    </Span>
                  </Text>
                </View>
                <View
                  style={{
                    marginBottom: 5,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Image source={punto} style={{ width: 5, height: 5 }}></Image>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#595958",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    Modelo 145{" "}
                    <Span style={{ fontWeight: 800, color: "#D50032" }}>
                      *NUEVO
                    </Span>
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 17,
                  color: "#595958",
                  marginBottom: 15,
                }}
              >
                *Estos servicios solo se ofrecen a través del WhatApp.
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: "#595958",
                  marginBottom: 15,
                }}
              >
                Recuerda que para ACCIONA tus datos personales son muy
                importantes y es por ello que se tratan con la mayor seguridad y
                confidencialidad.
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#d4d4d4",
                padding: 10,
                paddingBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#595958",
                  marginBottom: 15,
                  fontWeight: 600,
                }}
              >
                CONTACTO CON TU ASISTENTE VIRTUAL
              </Text>

              <Text
                style={{
                  fontSize: 17,
                  color: "#595958",
                  marginBottom: 5,
                }}
              >
                Dirígete a través:
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "45%" }}>
                  <Button
                    style={{
                      borderWidth: 2,
                      borderColor: "#595958",
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                    onPress={() => {
                      const phoneNumber = "932075053";
                      const url = `whatsapp://send?phone=${phoneNumber}`;

                      Linking.canOpenURL(url).then((supported) => {
                        if (supported) {
                          Linking.openURL(url);
                        } else {
                          const webUrl = `https://wa.me/${phoneNumber}`;
                          Linking.openURL(webUrl);
                        }
                      });
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={whatsapp}
                        style={{
                          width: 30,
                          height: 30,
                          marginTop: 18,
                        }}
                        resizeMode="contain"
                      ></Image>
                      <Text
                        style={{
                          fontWeight: 600,
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        WhatsApp
                      </Text>
                      <Text
                        style={{
                          fontWeight: 600,
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        93 207 50 53
                      </Text>
                    </View>
                  </Button>
                </View>
                <View style={{ width: "45%" }}>
                  <Button
                    style={{
                      borderWidth: 2,
                      borderColor: "#595958",
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={telefono}
                        style={{
                          width: 30,
                          height: 30,
                          marginTop: 18,
                        }}
                        resizeMode="contain"
                      ></Image>
                      <Text
                        style={{
                          fontWeight: 600,
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        Teléfono
                      </Text>
                      <Text
                        style={{
                          fontWeight: 600,
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        91 123 92 43
                      </Text>
                    </View>
                  </Button>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 17,
                  color: "#595958",
                  marginBottom: 5,
                }}
              >
                El asistente te contestará en tu correo electrónico facilitado.
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: "#595958",
                  fontWeight: 600,
                  marginBottom: 5,
                }}
              >
                ¡Estamos a tu disposición!
              </Text>
            </View>
          </ScrollView>
        </Box>
      </SafeAreaView>
    </>
  );
}

export default PantallaAsistenteVirtual;

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "#D50032",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
