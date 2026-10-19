//id, carrera, promedio, nombre
package systemaeducativo1.model;

public class Estudiante {

    private int id;
    private String carrera;
    private String nombre;
    private Double promedio;

    public Estudiante(String carrera, String nombre, String carrera1, double promedio) {
        this.id = id;
        this.carrera = carrera;
        this.nombre = nombre;
        this.promedio = promedio;
    }

    @Override
    public String toString() {
        return "Estudiante{" + "id=" + id + ", carrera=" + carrera + ", nombre=" + nombre + ", promedio=" + promedio + '}';
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCarrera() {
        return carrera;
    }

    public void setCarrera(String carrera) {
        this.carrera = carrera;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPromedio() {
        
        return promedio;
    }

    public void setPromedio(Double promedio) {
        this.promedio = promedio;
    }
}
