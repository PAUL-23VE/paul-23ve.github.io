import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

function About() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="container mx-auto max-w-4xl py-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Foto con animación minimalista */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-56 h-56 md:w-64 md:h-64"
          >
            <img
              src="/tu-foto.jpg"
              alt="Paul Velastegui - Desarrollador Web"
              className="w-full h-full rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-800"
            />
          </motion.div>

          {/* Contenido textual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center lg:text-left mt-8 lg:mt-0"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-3">
              Paul <span className="text-indigo-600 dark:text-indigo-400">Velastegui</span>
            </h1>

            <div className="h-10 md:h-12 mb-5 text-lg md:text-xl">
              <TypeAnimation
                sequence={[
                  'Desarrollador Fullstack',
                  2000,
                  'Enfocado en Frontend',
                  2000,
                  'Estudiante de Ingeniería',
                  2000,
                ]}
                wrapper="span"
                speed={40}
                className="text-indigo-500 dark:text-indigo-400 font-medium"
                repeat={Infinity}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Estudiante de 6to semestre de Ingeniería de Software con pasión por el desarrollo web. 
              Especializado en crear interfaces modernas con React y Tailwind CSS, 
              complementando con habilidades back-end para soluciones completas.
            </motion.p>
          </motion.div>
        </div>

        {/* Tecnologías como acento decorativo (sin interacción) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-14 flex flex-wrap justify-center gap-3 text-sm md:text-base"
        >
        </motion.div>
      </div>
    </section>
  );
}

export default About;