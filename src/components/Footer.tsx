
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-angola-primary text-white py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              Ango<span className="text-angola-accent">Job</span>
            </h3>
            <p className="text-angola-secondary text-sm">
              O melhor site para encontrar vagas de emprego em Angola. 
              Conectamos profissionais a oportunidades de carreira em todo o país.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-angola-secondary hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="text-angola-secondary hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-angola-secondary hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-angola-secondary hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-angola-secondary hover:text-white transition-colors">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-angola-secondary hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-angola-secondary hover:text-white transition-colors">
                <i className="fab fa-linkedin-in text-xl"></i>
              </a>
              <a href="#" className="text-angola-secondary hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-angola-secondary text-sm">
          <p>&copy; {new Date().getFullYear()} AngoJob. Todos os direitos reservados.</p>
          <p className="mt-1">
            Este sistema respeita as políticas do robots.txt e faz scraping de dados de forma ética.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
