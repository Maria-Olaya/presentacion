import tkinter as tk
from tkinter import messagebox
from tkinter import ttk, messagebox
import mysql.connector


# Conectar a la base de datos
def conectar():
    return mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="7019./Gto",
        database="mydb"
    )

def cantidad_clientes_atendidos(id_agente_param):
    db = conectar()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT COUNT(*) FROM cliente WHERE id_agente = %s", (id_agente_param,))
        cantidad = cursor.fetchone()[0]
        return cantidad
    except mysql.connector.Error as err:
        messagebox.showerror("Error", f"Error: {err}")
    finally:
        cursor.close()
        db.close()

def abrir_ventana_dato(funcion):
    ventana_dato = tk.Toplevel()
    ventana_dato.title("Ingresar Dato")

    tk.Label(ventana_dato, text=f"Ingrese el dato para la función {funcion}:").pack(padx=10, pady=5)
    dato_entry = tk.Entry(ventana_dato)
    dato_entry.pack(padx=10, pady=5)

    def ejecutar_funcion():
        dato = dato_entry.get()
        resultado = funcion(dato)
        messagebox.showinfo("Resultado", f"El resultado de la función es: {resultado}")

    tk.Button(ventana_dato, text="Ejecutar Función", command=ejecutar_funcion).pack(padx=10, pady=5)

def mostrar_datos(tabla):
    db = conectar()
    cursor = db.cursor()
    try:
        cursor.execute(f"SELECT * FROM {tabla}")
        datos = cursor.fetchall()
        mostrar_tabla(tabla, datos)
    except mysql.connector.Error as err:
        messagebox.showerror("Error", f"Error: {err}")
    finally:
        cursor.close()
        db.close()

def mostrar_tabla(tabla, datos):
    ventana_tabla = tk.Toplevel()
    ventana_tabla.title(f"Datos de {tabla}")

    tabla_frame = ttk.Frame(ventana_tabla)
    tabla_frame.pack(fill="both", expand=True)

    tabla = ttk.Treeview(tabla_frame, columns=datos[0], show="headings")
    tabla.pack(fill="both", expand=True)

    for col in datos[0]:
        tabla.heading(col, text=col)

    for dato in datos[1:]:
        tabla.insert("", "end", values=dato)


# Función para agregar un cliente
def agregar_cliente():
    cedula = cedula_entry.get()
    nombre = nombre_entry.get()
    id_agente = id_agente_entry.get()
    direccion = direccion_entry.get()
    telefono = telefono_entry.get()
    email = email_entry.get()

    db = conectar()
    cursor = db.cursor()
    try:
        cursor.callproc('AgregarCliente', [cedula, nombre, id_agente, direccion, telefono, email])
        db.commit()
        messagebox.showinfo("Éxito", "Cliente agregado correctamente")
    except mysql.connector.Error as err:
        messagebox.showerror("Error", f"Error: {err}")
    finally:
        cursor.close()
        db.close()


# Función para eliminar un cliente
def eliminar_cliente():
    cedula = cedula_entry.get()

    db = conectar()
    cursor = db.cursor()
    try:
        cursor.callproc('EliminarCliente', [cedula])
        db.commit()
        messagebox.showinfo("Éxito", "Cliente eliminado correctamente")
    except mysql.connector.Error as err:
        messagebox.showerror("Error", f"Error: {err}")
    finally:
        cursor.close()
        db.close()


# Función para actualizar un cliente
def actualizar_cliente():
    cedula = cedula_entry.get()
    nombre = nombre_entry.get()
    id_agente = id_agente_entry.get()
    direccion = direccion_entry.get()
    telefono = telefono_entry.get()
    email = email_entry.get()

    db = conectar()
    cursor = db.cursor()
    try:
        cursor.callproc('ActualizarCliente', [cedula, nombre, id_agente, direccion, telefono, email])
        db.commit()
        messagebox.showinfo("Éxito", "Cliente actualizado correctamente")
    except mysql.connector.Error as err:
        messagebox.showerror("Error", f"Error: {err}")
    finally:
        cursor.close()
        db.close()


# Función para agregar un empleado
def agregar_empleado():
    cedula = cedula_entry.get()
    nombre = nombre_entry.get()
    especializacion = especializacion_entry.get()
    telefonos = telefonos_entry.get()
    idiomas = idiomas_entry.get()

    db = conectar()
    cursor = db.cursor()
    try:
        cursor.callproc('AgregarEmpleado', [cedula, nombre, especializacion, telefonos, idiomas])
        db.commit()
        messagebox.showinfo("Éxito", "Empleado agregado correctamente")
    except mysql.connector.Error as err:
        messagebox.showerror("Error", f"Error: {err}")
    finally:
        cursor.close()
        db.close()


# Función para eliminar un empleado
def eliminar_empleado():
    cedula = cedula_entry.get()

    db = conectar()
    cursor = db.cursor()
    try:
        cursor.callproc('EliminarEmpleado', [cedula])
        db.commit()
        messagebox.showinfo("Éxito", "Empleado eliminado correctamente")
    except mysql.connector.Error as err:
        messagebox.showerror("Error", f"Error: {err}")
    finally:
        cursor.close()
        db.close()


# Función para actualizar un empleado
def actualizar_empleado():
    cedula = cedula_entry.get()
    nombre = nombre_entry.get()
    especializacion = especializacion_entry.get()
    telefonos = telefonos_entry.get()
    idiomas = idiomas_entry.get()

    db = conectar()
    cursor = db.cursor()
    try:
        cursor.callproc('ActualizarEmpleado', [cedula, nombre, especializacion, telefonos, idiomas])
        db.commit()
        messagebox.showinfo("Éxito", "Empleado actualizado correctamente")
    except mysql.connector.Error as err:
        messagebox.showerror("Error", f"Error: {err}")
    finally:
        cursor.close()
        db.close()


# Función para volver al menú principal
def volver_al_menu(principal, ventana_actual):
    ventana_actual.destroy()
    principal.deiconify()


# Configuración de la ventana principal
root = tk.Tk()
root.title("Menú Principal")


def abrir_empresa():
    root.withdraw()
    empresa_ventana = tk.Toplevel(root)
    empresa_ventana.title("Gestión de Empresa")

    # Campos de entrada
    tk.Label(empresa_ventana, text="Cédula:").grid(row=0, column=0, padx=10, pady=5)
    global cedula_entry
    cedula_entry = tk.Entry(empresa_ventana)
    cedula_entry.grid(row=0, column=1, padx=10, pady=5)

    tk.Label(empresa_ventana, text="Nombre:").grid(row=1, column=0, padx=10, pady=5)
    global nombre_entry
    nombre_entry = tk.Entry(empresa_ventana)
    nombre_entry.grid(row=1, column=1, padx=10, pady=5)

    tk.Label(empresa_ventana, text="Especialización:").grid(row=2, column=0, padx=10, pady=5)
    global especializacion_entry
    especializacion_entry = tk.Entry(empresa_ventana)
    especializacion_entry.grid(row=2, column=1, padx=10, pady=5)

    tk.Label(empresa_ventana, text="Teléfonos:").grid(row=3, column=0, padx=10, pady=5)
    global telefonos_entry
    telefonos_entry = tk.Entry(empresa_ventana)
    telefonos_entry.grid(row=3, column=1, padx=10, pady=5)

    tk.Label(empresa_ventana, text="Idiomas:").grid(row=4, column=0, padx=10, pady=5)
    global idiomas_entry
    idiomas_entry = tk.Entry(empresa_ventana)
    idiomas_entry.grid(row=4, column=1, padx=10, pady=5)

    # Botones para llamar a las funciones
    tk.Button(empresa_ventana, text="Agregar Empleado", command=agregar_empleado).grid(row=5, column=0, padx=10, pady=5)
    tk.Button(empresa_ventana, text="Eliminar Empleado", command=eliminar_empleado).grid(row=5, column=1, padx=10,
                                                                                        pady=5)
    tk.Button(empresa_ventana, text="Actualizar Empleado", command=actualizar_empleado).grid(row=6, column=0,
                                                                                            columnspan=2, padx=10,
                                                                                            pady=5)
    tk.Button(empresa_ventana, text="Regresar", command=lambda: volver_al_menu(root, empresa_ventana)).grid(row=7,
                                                                                                              column=0,
                                                                                                              columnspan=2,
                                                                                                              padx=10,
                                                                                                              pady=5)


def abrir_usuarios():
    root.withdraw()
    usuarios_ventana = tk.Toplevel(root)
    usuarios_ventana.title("Gestión de Usuarios")

    # Campos de entrada para la gestión de clientes
    tk.Label(usuarios_ventana, text="Cédula:").grid(row=0, column=0, padx=10, pady=5)
    global cedula_entry
    cedula_entry = tk.Entry(usuarios_ventana)
    cedula_entry.grid(row=0, column=1, padx=10, pady=5)

    tk.Label(usuarios_ventana, text="Nombre:").grid(row=1, column=0, padx=10, pady=5)
    global nombre_entry
    nombre_entry = tk.Entry(usuarios_ventana)
    nombre_entry.grid(row=1, column=1, padx=10, pady=5)

    tk.Label(usuarios_ventana, text="ID Agente:").grid(row=2, column=0, padx=10, pady=5)
    global id_agente_entry
    id_agente_entry = tk.Entry(usuarios_ventana)
    id_agente_entry.grid(row=2, column=1, padx=10, pady=5)

    tk.Label(usuarios_ventana, text="Dirección:").grid(row=3, column=0, padx=10, pady=5)
    global direccion_entry
    direccion_entry = tk.Entry(usuarios_ventana)
    direccion_entry.grid(row=3, column=1, padx=10, pady=5)

    tk.Label(usuarios_ventana, text="Teléfono:").grid(row=4, column=0, padx=10, pady=5)
    global telefono_entry
    telefono_entry = tk.Entry(usuarios_ventana)
    telefono_entry.grid(row=4, column=1, padx=10, pady=5)

    tk.Label(usuarios_ventana, text="Email:").grid(row=5, column=0, padx=10, pady=5)
    global email_entry
    email_entry = tk.Entry(usuarios_ventana)
    email_entry.grid(row=5, column=1, padx=10, pady=5)

    # Botones para las funciones de gestión de clientes
    tk.Button(usuarios_ventana, text="Agregar Cliente", command=agregar_cliente).grid(row=6, column=0, padx=10, pady=5)
    tk.Button(usuarios_ventana, text="Eliminar Cliente", command=eliminar_cliente).grid(row=6, column=1, padx=10,
                                                                                        pady=5)
    tk.Button(usuarios_ventana, text="Actualizar Cliente", command=actualizar_cliente).grid(row=7, column=0,
                                                                                            columnspan=2, padx=10,
                                                                                            pady=5)
    tk.Button(usuarios_ventana, text="Regresar", command=lambda: volver_al_menu(root, usuarios_ventana)).grid(row=8,
                                                                                                              column=0,
                                                                                                              columnspan=2,
                                                                                                              padx=10,
                                                                                                              pady=5)


def abrir_datos():
    root.withdraw()
    datos_ventana = tk.Toplevel(root)
    datos_ventana.title("Datos")

    # Lista de opciones
    opciones = [
        "Mostrar datos de la tabla cliente",
        "Mostrar datos de la tabla empleado",
        "Mostrar datos de la tabla telefono_cliente",
        "Mostrar datos de la tabla telefono_empleado",
        "Mostrar datos de la tabla direccion",
        "Mostrar datos de la tabla correo",
        "Mostrar datos de la tabla idioma",
        "Cantidad de clientes atendidos por agente"
    ]

    # Funciones para las opciones
    funciones = [
        lambda: mostrar_datos("cliente"),
        lambda: mostrar_datos("empleado"),
        lambda: mostrar_datos("telefono_cliente"),
        lambda: mostrar_datos("telefono_empleado"),
        lambda: mostrar_datos("direccion"),
        lambda: mostrar_datos("correo"),
        lambda: mostrar_datos("idioma"),
        lambda: abrir_ventana_dato(cantidad_clientes_atendidos)
    ]

    # Widgets para la selección de opción y ejecución
    tk.Label(datos_ventana, text="Seleccione una opción:").pack(padx=10, pady=5)
    opcion_var = tk.StringVar(datos_ventana)
    opcion_var.set(opciones[0])  # Valor por defecto
    option_menu = tk.OptionMenu(datos_ventana, opcion_var, *opciones)
    option_menu.pack(padx=10, pady=5)

    # Botón para ejecutar la opción seleccionada
    tk.Button(datos_ventana, text="Mostrar", command=lambda: funciones[opciones.index(opcion_var.get())]()).pack(padx=10, pady=5)

    # Botón para regresar al menú principal
    tk.Button(datos_ventana, text="Regresar", command=lambda: volver_al_menu(root, datos_ventana)).pack(padx=10, pady=5)
# Botones del menú principal
tk.Button(root, text="Empresa", command=abrir_empresa).pack(padx=20, pady=10)
tk.Button(root, text="Usuarios", command=abrir_usuarios).pack(padx=20, pady=10)
tk.Button(root, text="Datos", command=abrir_datos).pack(padx=20, pady=10)



# Bucle principal de la interfaz
root.mainloop()


