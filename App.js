import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";

const UselessTextInput = (props) => {
  return <TextInput {...props} editable maxLength={40} />;
};

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        style={{
          fontSize: 30,
          textAlign: "center",
          fontFamily: "sans-serif-medium",
        }}
      >
        APProductos
      </Text>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Pressable
          onPress={() => {
            navigation.navigate("Categorias");
          }}
          children={
            <View
              style={{
                margin: 10,
              }}
            >
              <Image
                style={{
                  width: 80,
                  height: 80,
                }}
                source={{
                  uri: "https://img.icons8.com/office/80/000000/no-barcode.png",
                }}
              />

              <Text>Categorias</Text>
            </View>
          }
        />

        <Pressable
          onPress={() => {
            navigation.navigate("Productos");
          }}
          children={
            <View
              style={{
                margin: 10,
              }}
            >
              <Image
                style={{
                  width: 80,
                  height: 80,
                }}
                source={{
                  uri: "https://img.icons8.com/arcade/80/000000/experimental-shop-arcade.png",
                }}
              />

              <Text>Productos</Text>
            </View>
          }
        />
      </View>

      <Pressable
        onPress={() => {
          navigation.navigate("Lista de Productos");
        }}
        children={
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 80,
                height: 80,
              }}
              source={{
                uri: "https://img.icons8.com/dusk/80/000000/list--v1.png",
              }}
            />
            <Text>Lista de Productos</Text>
          </View>
        }
      />
    </View>
  );
}

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [update, setUpdate] = useState(true);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const getProductos = async () => {
    const categorias = await axios({
      method: "get",
      url: `https://c9f6-2800-200-f100-6016-287-f1c3-7006-6ed0.ngrok.io/api/categorias`,
    })
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    const categoria = await categorias;
    return categoria;
  };

  useEffect(() => {
    getProductos();
  }, [update]);

  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Formulario de categorias
      </Text>
      <View>
        <Text>Nombre de categoria</Text>
        <UselessTextInput
          multiline
          numberOfLines={1}
          onChangeText={(text) => setNombre(text)}
          value={nombre}
          style={{
            padding: 5,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />
        <Text>Descripcion de categoria</Text>
        <UselessTextInput
          multiline
          numberOfLines={1}
          onChangeText={(text) => setDescripcion(text)}
          value={descripcion}
          style={{
            padding: 5,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />
        <Button
          title="GRABAR"
          onPress={() => {
            axios({
              method: "post",
              url: `https://c9f6-2800-200-f100-6016-287-f1c3-7006-6ed0.ngrok.io/api/categorias`,
              data: {
                nombre: nombre,
                descripcion: descripcion,
              },
            })
              .then((response) => {
                setUpdate(!update);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        />
      </View>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginTop: 10,
        }}
      >
        Lista de categorias
      </Text>
      <View style={{ padding: 20 }}>
        {categorias &&
          categorias.map((categoria) => {
            return (
              <View
                key={categoria.id}
                style={{
                  padding: 10,
                  borderColor: "transparent",
                  borderBottomColor: "#ccc",
                  borderWidth: 1,
                }}
              >
                <Text>Nombre: {categoria.nombre}</Text>
                <Text>Descripcion: {categoria.descripcion}</Text>
              </View>
            );
          })}
      </View>
    </View>
  );
}

function Productos() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [image, setImage] = useState(null);
  const getProductos = async () => {
    const categorias = await axios({
      method: "get",
      url: `https://c9f6-2800-200-f100-6016-287-f1c3-7006-6ed0.ngrok.io/api/categorias`,
    })
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    const categoria = await categorias;
    return categoria;
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const editUserProfile = () =>
    new Promise(async (resolve, reject) => {
      var data = new FormData();
      data.append("nombre", nombre);
      data.append("precio", precio);
      data.append("category", idCategoria);
      data.append("stock", descripcion);
      data.append("image", {
        uri: image,
        name: `${image.split("/")[image.split("/").length - 1]}`,
        type: `image/jpg`,
      });

      const response = await axios
        .post(
          "https://c9f6-2800-200-f100-6016-287-f1c3-7006-6ed0.ngrok.io/api/products",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch((err) => {
          console.log(err);
        });
      return await response;
    });

  useEffect(() => {
    getProductos();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Productos
      </Text>
      <Text>Categoría del producto</Text>
      <RNPickerSelect
        value={idCategoria}
        onValueChange={(value) => setIdCategoria(value)}
        style={{
          padding: 5,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 10,
        }}
        items={categorias.map((item) => {
          return {
            label: item.nombre,
            value: item.id,
          };
        })}
      />
      <Text>Nombre del producto</Text>
      <UselessTextInput
        multiline
        numberOfLines={1}
        onChangeText={(text) => setNombre(text)}
        value={nombre}
        style={{
          padding: 5,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 10,
        }}
      />
      <Text>Precio</Text>
      <UselessTextInput
        multiline
        numberOfLines={1}
        onChangeText={(text) => setPrecio(text)}
        value={precio}
        style={{
          padding: 5,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 10,
        }}
      />
      <Text>Descripcion</Text>
      <UselessTextInput
        multiline
        numberOfLines={3}
        onChangeText={(text) => setDescripcion(text)}
        value={descripcion}
        style={{
          padding: 5,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 10,
        }}
      />
      <Text>Imagen</Text>
      <Button title="Elegir imagen" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
      )}

      <Button
        title="GRABAR"
        onPress={() => {
          editUserProfile();
        }}
      />
    </View>
  );
}

function ListaProducts() {
  const [productsList, setProductList] = useState([]);
  const [update, setUpdate] = useState(false);
  const getProductos = async () => {
    const productos = await axios({
      method: "get",
      url: `http://c9f6-2800-200-f100-6016-287-f1c3-7006-6ed0.ngrok.io/api/products`,
    })
      .then((response) => {
        setProductList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    const product = await productos;
    return product;
  };

  const eliminarProducto = async (id) => {
    const response = await axios.post(
      `http://c9f6-2800-200-f100-6016-287-f1c3-7006-6ed0.ngrok.io/api/products/delete`,
      {
        id: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await response;
    setUpdate(!update);
    return res;
  };

  useEffect(() => {
    getProductos();
  }, [update]);
  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Lista de Product
      </Text>
      <View>
        {productsList &&
          productsList.map((product) => (
            <View
              key={product.id}
              style={{
                display: "flex",
                flexDirection: "row",
                borderColor: "transparent",
                padding: 10,
                borderBottomColor: "#ccc",
                borderWidth: 1,
              }}
            >
              <Image
                source={{
                  uri:
                    "https://c9f6-2800-200-f100-6016-287-f1c3-7006-6ed0.ngrok.io/api/images/" +
                    product.images,
                }}
                style={{
                  width: 80,
                  height: 80,
                  marginRight: 10,
                }}
              />
              <View>
                <Text>Nombre del producto: {product.nombre}</Text>
                <Text>Precio:{product.precio}</Text>
                <Text>Descripcion:{product.descripcion}</Text>
                <Button
                  onPress={() => {
                    eliminarProducto(product.id);
                  }}
                  title="Eliminar"
                />
              </View>
            </View>
          ))}
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Categorias" component={Categorias} />
        <Stack.Screen name="Productos" component={Productos} />
        <Stack.Screen name="Lista de Productos" component={ListaProducts} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
