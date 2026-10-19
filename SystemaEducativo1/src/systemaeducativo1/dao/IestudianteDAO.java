
package systemaeducativo1.dao;
 
import java.util.ArrayList;
import systemaeducativo1.model.Estudiante;

public interface IestudianteDAO  {
    
    
    boolean registrar(Estudiante e);
    
    Estudiante buscarPorCodigo(int id);
    
    ArrayList<Estudiante> listar();
    
    boolean actualizar(Estudiante e);
        
    boolean eliminar(int id);
    
            
    
}        
          
   
   

