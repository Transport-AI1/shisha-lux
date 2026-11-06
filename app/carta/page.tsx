"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Item = { name: string; price?: string; detail?: string; tag?: string };
type Section = { id: string; icon: string; name: string; intro?: string; items: Item[] };
type ItemRating = { average: number; count: number };
const sections: Section[] = [
 {id:"cachimbas",icon:"💨",name:"Cachimbas",intro:"Elige entre nuestras gamas de sabores. Consulta disponibilidad de sabores en el local.",items:[
  {name:"Meduse Seabloom",price:"20 €",detail:"Precio para todo tipo de tabaco. Consumo de bebida por persona obligatorio.",tag:"Especial"},
  {name:"Nuevos sabores",price:"15 €",detail:"Blowtus · #040 · Iscream Pistacio · Dubai Original Stachio · Danonino · AMG · CU Chill · Gumtastic · White Bear · Dive"},
  {name:"Sabores Rubio",price:"15 €",detail:"Miss Joosy · Ice Kaktus · Bono · Quiwi Punch · Winter Edition · Yellow Punch · Mr.C · Willy Punch · Big Blue · Two Apple · Lady Killer · Love · Casper · Nairobi · Utopia · Carnival · Euphoria · Touch · African Queen · Desert Dream y más."},
  {name:"Sabores Black",price:"18 €",detail:"Kendi-Co · Epic Guru · Pinkman · Raspi · Morocco · Neptune · Cosmos · Uranus · Koko Dream · Real P.F. · Summer Basket · Ekzotic M · Code · Explosion · Dark Nana y más."},
  {name:"Lux Fusión",price:"18 €",detail:"Mezclas Lux de tabaco rubio y negro: Tropius · Alcremei · Tsareena."},
  {name:"Kaloud",price:"2 €",detail:"Suplemento."},{name:"Ice-Bazoka",price:"2 €",detail:"Suplemento."},{name:"Base fría o cremosa",price:"0 €"}
 ]},
 {id:"food",icon:"🍕",name:"Food",intro:"Para picar y compartir.",items:[
  {name:"Pizza Lux",price:"13 €",detail:"Mozzarella, tomate, orégano y salsa especial Lux."},{name:"Pizza York-Queso",price:"13 €",detail:"Jamón York, mozzarella, tomate y orégano.",tag:"Nuevo"},
  {name:"Pizza Margarita",price:"13 €",detail:"Mozzarella, tomate y orégano."},{name:"Pizza Soppressata",price:"13 €",detail:"Tomate, mozzarella, pimientos, sobrasada y cebolla morada."},
  {name:"Brochetas de pollo",price:"9 €",detail:"Marinadas en salsa de soja con barbacoa y sésamo."},{name:"Batatas dulces fritas",price:"6 €"},{name:"Mac and Cheese (6 uds)",price:"5 €"},{name:"Nachos",price:"12 €",detail:"Queso fundido, frijoles, jalapeños, guacamole y salsas."},{name:"Fingers de pollo",price:"9 €"},{name:"Patatas fritas",price:"6 €"},{name:"Fingers de mozzarella",price:"9 €"},{name:"Tequeños de queso",price:"10 €"},{name:"Hot-Dog Rolls + patatas",price:"12 €"},{name:"Bacon Cheese Fries",price:"10 €",detail:"Patatas, bacon, mozzarella y salsa ranchera.",tag:"Más vendido"},{name:"Aros de cebolla",price:"7 €"},{name:"Helado italiano",price:"5 €",detail:"2 bolas. Vainilla, tiramisú, frutos del bosque, pistacho, chocolate, caramelo salado o stracciatella."},{name:"Tequeños de Nutella",price:"9 €",detail:"Con salsa de chocolate blanco."}
 ]},
 {id:"hamburguesas",icon:"🍔",name:"Hamburguesas deluxe",intro:"Hamburguesas by Shisha Lux.",items:[
  {name:"Hamburguesa Lux",price:"15 €",detail:"Pan brioche, carne de vaca madurada, cebolla caramelizada, cheddar, bacon, pepinillo y salsa Lux.",tag:"La reina de la casa"},
  {name:"Spicy Chicken",price:"13 €",detail:"Brioche, pollo rebozado, cheddar picante, cebolla caramelizada, ajonesa y aros de cebolla."},
  {name:"La Serrana",price:"15 €",detail:"Brioche, vaca madurada, cheddar ahumado, cebolla caramelizada, barbacoa y torreznos de Soria."}
 ]},
 {id:"cocktails",icon:"🍸",name:"Cocktails",intro:"Nuestros cócteles exclusivos y clásicos. Todos pueden servirse sin alcohol.",items:[
  {name:"Kitsune",price:"15 €",detail:"Ginebra Brockmans, mora, fresa y lima."},{name:"Rainbow Lips",price:"15 €",detail:"Cîroc Red Berry, Amaretto, piña, lima y granadina."},{name:"P.A.N.D.A.",price:"15 €",detail:"Cacique 500, triple seco, piña, naranja y coco."},{name:"Shisha Lux",price:"15 €",detail:"Cîroc Coconut, tequila melón, puré y sirope de melón."},{name:"Bob-Omb · degustación 3 cócteles",price:"25 €",detail:"P.A.N.D.A., Kitsune y Rainbow Lips."},{name:"Jack Skellington",price:"10,50 €",detail:"Rives Exotica, canela, Martini rojo, lima y mora. Disponible sin alcohol."},{name:"Sally",price:"10,50 €",detail:"Vodka, melocotón, blue curaçao y toque de chicle."},{name:"Porn Star Martini",price:"13 €"},{name:"Don Julio Sunrise",price:"15 €"},{name:"House Cocktail",price:"9 €"},{name:"Cocktail Classic",price:"9 €"},{name:"Bloody Mary",detail:"Consultar precio."},{name:"Moscow Mule",detail:"Consultar precio."},{name:"Aperol Spritz",detail:"Consultar precio."},{name:"Piña Colada",detail:"Consultar precio."},{name:"Sex on the Beach",detail:"Consultar precio."},{name:"Margarita",detail:"Consultar precio."}
 ]},
 {id:"mojitos",icon:"🍹",name:"Mojitos & Daikiris",items:[
  {name:"Mojito Classic",price:"9,50 €"},{name:"Mojito Strawberry",price:"9,50 €"},{name:"Mojito Cantaloupe (melón)",price:"9,50 €"},{name:"Mojito Mango",price:"9,50 €"},{name:"Mojito Blackberry (mora)",price:"9,50 €"},{name:"Double Mojito XL",price:"16 €",detail:"Clásico, fresa, mango, mora, maracuyá, melón o sandía."},{name:"Mojito Gin",price:"10 €",detail:"Classic o Strawberry."},{name:"Daikiri Strawberry",price:"9,50 €"},{name:"Daikiri Mango",price:"9,50 €"},{name:"Daikiri Watermelon",price:"9,50 €"},{name:"Daikiri Maracuyá",price:"9,50 €"}
 ]},
 {id:"milkshakes",icon:"🥤",name:"Milkshakes",items:[
  {name:"Galleta Lotus",price:"9 €"},{name:"Pistachio",price:"10 €",detail:"Leche, crema y helado de pistacho, pistacho triturado y nata.",tag:"Nuevo"},{name:"Oreo",price:"9 €"},{name:"Kinder Bueno",price:"9 €"},{name:"Happy Hippo",price:"9 €"},{name:"Filipinos chocolate blanco",price:"9 €"},{name:"Chips Ahoy",price:"9 €"}
 ]},
 {id:"smoothies",icon:"🫐",name:"Smoothies",items:[
  {name:"Regulador",price:"8 €",detail:"Fresa y piña."},{name:"Energético",price:"8 €",detail:"Fresa y plátano."},{name:"Protector",price:"8 €",detail:"Mora y frambuesa."},{name:"Antioxidante",price:"8 €",detail:"Mango y piña."},{name:"Tropical",price:"8 €",detail:"Mango, piña y mora.",tag:"Recomendado"}
 ]},
 {id:"refrescos",icon:"🧊",name:"Refrescos",items:[
  {name:"Pepsi / Pepsi Max",price:"3 €"},{name:"Schweppes limón o naranja",price:"3 €"},{name:"7UP",price:"3 €"},{name:"Lipton Zero",price:"3,50 €"},{name:"Lipton Mango Maracuyá",price:"4 €",tag:"Nuevo"},{name:"Aquarade",price:"3,50 €"},{name:"Zumos",price:"3 €",detail:"Naranja, piña o melocotón."},{name:"Tónica Schweppes",price:"3 €"},{name:"Agua",price:"3 €"},{name:"Agua con gas",price:"3,50 €"},{name:"Red Bull y variedades",price:"4 €"},{name:"Red Bull Coco & Arándanos",price:"5 €"},{name:"Monster",price:"4 €"},{name:"Tónicas premium",price:"4 €",detail:"Toque lima, Hibiscus o Ginger Ale."}
 ]},
 {id:"cafe",icon:"☕",name:"Café",items:[
  {name:"Café con leche",price:"2 €"},{name:"Solo",price:"2 €"},{name:"Cortado",price:"2 €"},{name:"Americano",price:"2 €"},{name:"Café Bombón",price:"2,50 €"},{name:"Café Baileys",price:"3 €"},{name:"Frapuccino",price:"5 €",detail:"Café congelado. Toppings a elegir.",tag:"Nuevo"},{name:"ColaCao o Nesquik",price:"2 €"}
 ]},
 {id:"cervezas",icon:"🍺",name:"Cervezas",items:[
  {name:"Cubo tercios",price:"15 €",detail:"5 tercios Heineken o Águila."},{name:"Cubito Salitos",price:"23 €",detail:"6 unidades."},{name:"Águila sin filtrar 0,0",price:"4,50 €",tag:"Sin gluten"},{name:"Águila sin filtrar",price:"4,50 €"},{name:"Heineken",price:"4 €"},{name:"El Águila Dorada",price:"4 €"},{name:"Paulaner 500 ml",price:"5 €"},{name:"Desperados",price:"4 €"},{name:"Heineken 0,0",price:"3 €"},{name:"Amstel Oro 0,0 tostada",price:"3 €"},{name:"Cruzcampo",price:"4 €",tag:"Sin gluten"},{name:"Ladrón de Manzana",price:"4 €"},{name:"Salitos Pink / Blue",price:"4,50 €"},{name:"El Águila Dorada · pinta",price:"4,50 €"}
 ]},
 {id:"combinados",icon:"🥃",name:"Combinados",intro:"Selección de ron, whisky, vodka y ginebra.",items:[
  {name:"Barceló / Havana Club 5 / Cacique",price:"8 €"},{name:"Arehucas Ron Miel",price:"8 €"},{name:"Legendario",price:"9 €"},{name:"Barceló Imperial / Cacique 500",price:"12 €"},{name:"Zacapa 23",price:"15 €"},{name:"Red Label / Ballantine’s / DYC / Jameson",price:"8 €"},{name:"Four Roses",price:"10 €"},{name:"Jack Daniel’s / Honey",price:"10 €"},{name:"Black Label / Chivas 12",price:"12 €"},{name:"Hibiki Japanese",price:"25 €"},{name:"Absolut / Smirnoff",price:"8 €"},{name:"King Peter",price:"10 €"},{name:"Cîroc",price:"12 €"},{name:"Beefeater / Rives 1880 / Tanqueray",price:"8 €"},{name:"Brockmans / Hendrick’s / Nordés",price:"12 €"},{name:"Don Julio Blanco o Reposado",price:"15 €"}
 ]},
 {id:"licores",icon:"🧉",name:"Licores",items:[
  {name:"Licor de sabores",price:"3 €"},{name:"Crema de orujo",price:"4 €"},{name:"Pacharán",price:"4 €"},{name:"Baileys",price:"4 €"},{name:"Limoncello",price:"4 €"},{name:"Tequila de sabores · chupito",price:"2 €",detail:"Fresa, mango o melón."},{name:"Licor 43 / Jägermeister · chupito",price:"4 €"},{name:"Tequila José Cuervo · chupito",price:"4 €"},{name:"Botella José Cuervo Reposado",price:"50 €"}
 ]},
 {id:"botellas",icon:"🥂",name:"Champagne & botellas",items:[
  {name:"Luc Belaire (Rosé, Luxe, Bleu, Gold)",price:"60 €"},{name:"Moët Ice",price:"120 €"},{name:"Moët Rosé",price:"110 €"},{name:"Hibiki Japanese",price:"250 €",detail:"Cachimba incluida."},{name:"Don Julio Blanco o Reposado",price:"160 €",detail:"Cachimba incluida."},{name:"Blue Label",price:"420 €",detail:"Cachimba incluida."}
 ]},
 {id:"te",icon:"🍵",name:"Té e infusiones",items:[
  {name:"Negro Seducción",price:"2 €"},{name:"Rojo Fusione",price:"2 €"},{name:"Rojo Feel Good with Guaraná",price:"2 €"},{name:"Oolong Jengibre y Limón",price:"2 €"},{name:"Blanco Love Cúrcuma",price:"2 €"},{name:"Manzanilla",price:"2 €"},{name:"Menta Poleo",price:"2 €"},{name:"Rooibos Relax",price:"2 €"},{name:"Frutas del Bosque",price:"2 €"},{name:"Invierno",price:"2 €"},{name:"Rojo Frutal",price:"2 €"},{name:"Regamint",price:"2 €",detail:"Menta, regaliz y anís."}
 ]},
 {id:"vinos",icon:"🍷",name:"Vinos & vermú",items:[
  {name:"Vinos por copa",price:"3 €",detail:"Rioja, Ribera del Duero, Verdejo, rosado y otros."},{name:"Ramón Bilbao Rioja",price:"4 €",detail:"Botella 27 €."},{name:"Godello",price:"4,50 €",detail:"Botella 30 €."},{name:"Mar de Frades Albariño",price:"5 €",detail:"Botella 30 €."},{name:"Martini Rosso / Bianco",price:"4 €",detail:"Combinado 7 €."},{name:"Botella de vino",price:"20 €"},{name:"El Novio Perfecto",price:"20 €",detail:"Solo botella."}
 ]},
 {id:"meriendas",icon:"🥐",name:"Meriendas",items:[
  {name:"Crepes",price:"5 €",detail:"Chocolate belga, nata y frambuesa liofilizada."},{name:"Waffle & vainilla ice cream",price:"6,50 €",detail:"Gofre caliente, nata, helado y sirope.",tag:"Nuevo"},{name:"Sándwich mixto",price:"5 €",detail:"Jamón york o pavo y queso. Patatas +2,50 €.",tag:"Nuevo"},{name:"Zumo de naranja natural",price:"3 €",detail:"No siempre disponible."}
 ]},
 {id:"merch",icon:"🛍️",name:"Merchandise Lux",items:[
  {name:"Boquilla Shisha Lux",price:"7 €"},{name:"Kaloud (réplica)",price:"12 €"},{name:"Papel aluminio especial shishas",price:"8 €"},{name:"Lanyard Shisha Lux",price:"4 €"},{name:"Pods 600",price:"10 €",detail:"Varios sabores."},{name:"Cazoleta Oblako · edición Shisha Lux",price:"20 €"},{name:"Carbón 1 kg",price:"6 €",detail:"No es el cambio de carbón."}
 ]}
];
export default function CartaPage(){
 const [active,setActive]=useState("cachimbas"); const [query,setQuery]=useState("");
 const [ratings,setRatings]=useState<Record<string,ItemRating>>({});
 const [sendingRating,setSendingRating]=useState<string|null>(null);
 useEffect(()=>{fetch("/api/menu-ratings").then(r=>r.json()).then(d=>{if(d.ok)setRatings(d.ratings??{});}).catch(()=>{});},[]);
 async function rateItem(category:string,name:string,rating:number){const key=`${category}:${name}`;setSendingRating(key);try{const response=await fetch("/api/menu-ratings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({category,item:name,rating})});const data=await response.json();if(data.ok)setRatings(old=>({...old,[key]:data.rating}));}catch{}finally{setSendingRating(null);}}
 const current=sections.find(s=>s.id===active)??sections[0];
 const burgerPhotos = [
  "https://uploads.etersystem.es/uploads/601473067dd7285466040.32099615.jpeg",
  "https://uploads.etersystem.es/uploads/122902067dd7740a49984.36389273.jpeg",
  "https://uploads.etersystem.es/uploads/221205667dd79e6c51f25.33729097.jpeg"
 ];
 const filtered=useMemo(()=>current.items.filter(i=>(i.name+" "+(i.detail??"")+" "+(i.tag??"")).toLowerCase().includes(query.toLowerCase())),[current,query]);
 return <main className="menu-page">
  <header className="menu-nav"><Link href="/" className="menu-brand menu-brand-image"><img src="https://shishalux.es/images/logo_transparente.webp" alt="Shisha Lux" /></Link><Link href="/" className="menu-back">← Volver a la web</Link><button className="menu-download" onClick={()=>window.print()}>↓ Descargar carta PDF</button><a className="menu-book" href="https://www.covermanager.com/reservation/module_restaurant/SHISHA-LUX/spanish" target="_blank" rel="noreferrer">Reservar mesa ↗</a></header>
  <section className="menu-hero"><span className="menu-kicker">RIVAS · MADRID · ENJOY THE LUX MOMENT</span><h1>La carta<span>.</span></h1><p>Sabores, cócteles y pequeños grandes momentos.</p><div className="menu-rule"/></section>
  <div className="menu-layout"><aside className="menu-sidebar"><span className="menu-side-title">EXPLORA</span>{sections.map(s=><button key={s.id} className={active===s.id?"selected":""} onClick={()=>{setActive(s.id);setQuery("");}}><span>{s.icon}</span>{s.name}<i>↗</i></button>)}</aside>
   <section className="menu-content"><div className="menu-content-head"><div><span className="menu-kicker">SHISHA LUX · MENÚ</span><h2>{current.icon} {current.name}</h2>{current.intro&&<p>{current.intro}</p>}</div><label className="menu-search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar en esta categoría…"/></label></div>
    <div className="menu-mobile-cats">{sections.map(s=><button key={s.id} className={active===s.id?"selected":""} onClick={()=>{setActive(s.id);setQuery("");}}>{s.icon} {s.name}</button>)}</div>
    <div className="menu-items">{filtered.map((item,i)=><article className={"menu-item "+(current.id==="hamburguesas"?"menu-item-photo":"")} key={item.name}>{current.id==="hamburguesas"&&<img className="menu-food-photo" src={burgerPhotos[i%burgerPhotos.length]} alt={item.name+" de Shisha Lux"} loading="lazy"/>}<div className="menu-item-details"><div className="menu-item-top"><h3>{item.name}</h3>{item.price&&<strong>{item.price}</strong>}</div><div className="menu-item-rating" aria-label={`Valorar ${item.name}`}><span className="menu-rating-stars">{[1,2,3,4,5].map(star=><button className={star<=Math.round(ratings[`${current.id}:${item.name}`]?.average??0)?"rated":""} key={star} type="button" aria-label={`Dar ${star} estrellas a ${item.name}`} disabled={sendingRating===`${current.id}:${item.name}`} onClick={()=>rateItem(current.id,item.name,star)}>★</button>)}</span><span className="menu-rating-count">{ratings[`${current.id}:${item.name}`]?.average?.toFixed(1)??"0.0"} · {ratings[`${current.id}:${item.name}`]?.count??0}</span></div>{item.detail&&<p>{item.detail}</p>}{item.tag&&<span className="menu-tag">{item.tag}</span>}</div></article>)}</div>
    {filtered.length===0&&<p className="menu-empty">No hay resultados en esta categoría.</p>}
    <div className="menu-disclaimer">Los precios, productos y sabores pueden cambiar. Algunos artículos pueden no estar disponibles. Confirma cualquier detalle con el equipo de Shisha Lux.</div>
    <div className="menu-print-all">{sections.map(section=><section className="print-category" key={section.id}><h2>{section.icon} {section.name}</h2>{section.items.map(item=><div className="print-item" key={item.name}><div><b>{item.name}</b>{item.detail&&<small>{item.detail}</small>}</div><strong>{item.price||"Consultar"}</strong></div>)}</section>)}</div>
   </section>
  </div>
  <footer className="menu-footer"><div><b>SHISHA<span>LUX</span></b><p>Enjoy the Lux Moment.</p></div><div><p>Av. Aurelio Álvarez, 7 · Rivas-Vaciamadrid</p><a href="https://wa.me/34660461926" target="_blank" rel="noreferrer">Consultar por WhatsApp ↗</a></div></footer>
 </main>;
}
