import jsPDF from "jspdf"

function ticketPdf(sale){

    let heightOfDoc = (sale.sale_details.length * 4) + 70
    let orientationOfDoc = (heightOfDoc >= 80) ? 'p' : 'l'

    let y = 10
    var pdf = new jsPDF(orientationOfDoc, 'mm', [80, heightOfDoc])
    let width = pdf.internal.pageSize.getWidth()

    let date_issue = (new Date(sale.date_issue)).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: undefined
    })

    var companyName = pdf.splitTextToSize('MamaMia', 80)
    pdf.setFontSize(15);pdf.text(companyName, width/2, y,{align: "center"})
    pdf.setFontSize(8);pdf.text('RUC: 10157516286', width/2, y+=4,{align: "center"})
    pdf.setFontSize(8);pdf.text('Jr. Capitán Quiñonez 300', width/2, y+=3,{align: "center"})
    pdf.setFontSize(8);pdf.text('Lima - Lima - San Martin de Porres', width/2, y+=3,{align: "center"})
    pdf.setFontSize(8);pdf.text('Teléfono: 906 443 937', width/2, y+=3,{align: "center"})

    // pdf.line(2,y+=3,78,y, 'F')

    pdf.setFont(undefined, 'bold').setFontSize(9).text(sale.serie.voucher_type.description.toUpperCase(),width/2, y+=7,{align: "center"})
        .text(`${sale.serie.serie}-${String(sale.document_number).padStart(8,'0')}`.toUpperCase(),width/2, y+=4,{align: "center"})
        
    pdf.setFontSize(8).setFont(undefined, 'normal').text(`Fecha:  ${date_issue}`, 3, y+=6)
    pdf.setFontSize(8).text(`Cliente:  ${sale.customer.name}`, 3, y+=4)
    pdf.setFontSize(8).text(`Documento:  ${sale.customer.document}`, 3, y+=4)

    pdf.line(3,y+=3,77,y, 'F')

    pdf.setFontSize(7).setFont(undefined, 'bold')
    // pdf.text("CLAVE",3, y+=3);
    pdf.text("DESCRIPCION",3, y+=3);
    pdf.text("CANT.",48, y,{align: "center"})
    pdf.text("P/U",62, y,{align: "right"})
    pdf.text("TOTAL",75, y,{align: "right"})

    // pdf.text("DESCRIPCION",3, y+=3)

    pdf.line(3,y+=1,77,y, 'F')

    pdf.setFont(undefined, 'normal')
    for (const detail of sale.sale_details) {
        // pdf.text(detail.internal_code, 3, y+=3);
        pdf.text(detail.name.toUpperCase(), 3, y+=3);
        pdf.text(String(detail.quantity), 48, y,{align: "center"})
        pdf.text(detail.sale_price.toFixed(2), 62, y,{align: "right"})
        pdf.text(detail.total.toFixed(2), 75, y,{align: "right"})

        // pdf.text(detail.name.toUpperCase(),3, y+=3)
    }

    pdf.line(3,y+=1,77,y, 'F')

    pdf.setFont(undefined, 'bold').text("TOTAL A PAGAR",3, y+=3);
    pdf.text(sale.total.toFixed(2), 75, y,{align: "right"})


    







    // pdf.setFontSize(11);pdf.text(sale.serie.voucher_type.description.toUpperCase(),width/2, y+=7,{align: "center"})
    // pdf.setFontSize(11);pdf.text(`${sale.serie.serie}-${String(sale.document_number).padStart(8,'0')}`.toUpperCase(),width/2, y+=5,{align: "center"})

    pdf.output('dataurlnewwindow')
    pdf.autoPrint(false)

}

export { ticketPdf }