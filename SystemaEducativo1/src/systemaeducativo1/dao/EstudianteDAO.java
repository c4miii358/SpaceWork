
package systemaeducativo1.dao;

import java.util.ArrayList;
import systemaeducativo1.model.Estudiante;


public class EstudianteDAO implements IestudianteDAO{
    
    ArrayList<Estudiante>listaEstudiantes;
    private Estudiante estudiante;

    public EstudianteDAO() {
        
        listaEstudiantes= new ArrayList<>();
    }
   
    
    @Override
    public boolean registrar(Estudiante estudiante) {
        
        
        try {
            listaEstudiantes.add(estudiante);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }     
      
    }

    @Override
    public Estudiante buscarPorCodigo(int id) {
       Estudiante estud=null;
        try {
           
            for (Estudiante estudiante : listaEstudiantes) {
                if(estudiante.getId()==id){
                
                estud=estudiante;
                return estud;
                }
            }
            
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return estud;
        }
       return estud;
    }

    @Override
    public ArrayList<Estudiante> listar() {
        try {
         
            return listaEstudiantes;
            
        } catch (Exception e) {
            
          return null;
        }
 
    }

    @Override
    public boolean actualizar(Estudiante e) {
        boolean resp = false;        
      
        
        for (int i = 0; i < listaEstudiantes.size(); i++) {
            
            if (listaEstudiantes.get(i).getId()== e.getId()) {
                
                listaEstudiantes.set(i, e);
                resp=true;
            }
  
            
        }
        
        return resp;
    }

    @Override
    public boolean eliminar(int id) {
        boolean resp = false; 
        for (int i = 0; i < listaEstudiantes.size(); i++) {
            if (listaEstudiantes.get(i).getId()==e.getId) {
               listaEstudiantes.set(id, estudiante);
                resp=true;
            }
        }
 
       
        return resp;
    }
    
    
}
