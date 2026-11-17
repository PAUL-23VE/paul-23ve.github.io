import Link from "next/link";

import { FOOTER_DATA, SITE } from "@/constants";

export const Footer = () => {
  return (
    <footer className="w-full h-full bg-transparent text-gray-200 shadow-lg p-[15px] mt-10">
      <div className="w-full flex flex-col items-center justify-center m-auto">
        <div className="w-full h-full flex flex-row items-start justify-around flex-wrap gap-y-6">
          {FOOTER_DATA.map((column) => (
            <div
              key={column.title}
              className="min-w-[200px] h-auto flex flex-col items-center justify-start"
            >
              <h3 className="font-bold text-[16px]">{column.title}</h3>
              {column.data.map(({ icon: Icon, name, link }) => (
                <Link
                  key={`${column.title}-${name}`}
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex flex-row items-center my-[12px] hover:text-[rgb(160,130,255)] transition"
                >
                  {Icon && <Icon />}
                  <span className="text-[15px] ml-[6px]">{name}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 mb-[10px] text-[15px] text-center">
          &copy; {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
