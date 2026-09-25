import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const items = [
    {
      value: "description",
      title: "Опис товару",
      content:
        "Street style костюм оверсайз крою для справжніх маленьких модників. Худі з капюшоном на кулісці та просторі джогери з еластичним поясом. Універсальний базовий комплект, який легко поєднується з будь-яким гардеробом. Підходить як для прогулянок, так і для активних ігор протягом усього дня.",
    },
    {
      value: "care",
      title: "Склад та догляд",
      content:
        "95% бавовна, 5% еластан. Прати при температурі до 30°C у режимі для делікатних тканин. Не використовувати відбілювач. Прасувати при низькій температурі. Не сушити в сушильній машині — рекомендоване природне сушіння.",
    },
    {
      value: "delivery",
      title: "Доставка та оплата",
      content:
        "Доставка по Україні службами Нова Пошта та Укрпошта протягом 1–3 робочих днів. Безкоштовна доставка при замовленні від 2500 грн. Оплата онлайн карткою або накладеним платежем при отриманні. Обмін і повернення протягом 14 днів.",
    },
  ]
  
  export function ProductAccordion() {
    return (
      <Accordion type="single" collapsible defaultValue="description" className="w-full">
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide hover:no-underline">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }
  