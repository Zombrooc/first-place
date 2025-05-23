Public Draw as Application

' Public Const PAPER_SIZE=1200



Sub Teste()
    ' Script para CorelDRAW 2020 que:
    ' 1. Agrupa elementos em cada página
    ' 2. Cria uma nova página com 1000mm de largura e altura escalável
    ' 3. Move objetos agrupados para a nova página em formato de grid
    ' 4. Apaga as páginas originais
    
    Dim Draw As Application
    Dim corelDoc As Object
    Dim originalPages As Object
    Dim newPage As Object
    Dim page As Object
    Dim shape As Object
    Dim group As Object
    Dim allGroups As New Collection
    Dim i As Integer, j As Integer
    Dim contador As Integer
    ' Constantes de configuração
    Const GRID_SPACING As Double = 2 ' Espaçamento entre elementos (mm)
    Const PAGE_MARGIN As Double = 15 ' Margem da página (mm)
    Const NEW_PAGE_WIDTH As Double = 1200 ' Largura da nova página (mm)
    
    ' Verifica se existe um documento ativo
    If Draw.Documents.Count = 0 Then
        MsgBox "Nenhum documento aberto. Abra um documento do CorelDRAW primeiro.", vbExclamation
        Exit Sub
    End If
    
    ' Obter referência ao documento ativo
    Set corelDoc = Draw.ActiveDocument
    
    ' Obter todas as páginas originais
    Set originalPages = corelDoc.Pages
    Dim numPages As Integer
    numPages = originalPages.Count
    
    ' Fase 1: Agrupar elementos em cada página e guardar referências
    For i = 1 To numPages
        Set page = originalPages.Item(i)
        
        Debug.Print page
        
        ' Se não há formas na página, pule para a próxima
        If page.Shapes.Count > 0 Then
            ' Selecionar todos os elementos da página
            page.Shapes.All.CreateSelection
            
            ' Agrupar os elementos selecionados
            If Draw.ActiveSelection.Shapes.Count > 0 Then
                Set group = Draw.ActiveSelection.group
                
                ' Armazenar o grupo na coleção
                allGroups.Add group
            End If
        End If
    Next i
    
    ' Fase 2: Criar nova página com dimensões especificadas
    Set newPage = corelDoc.InsertPages(1, False, corelDoc.Pages.Count + 1)
    Set newPage = corelDoc.Pages.Item(corelDoc.Pages.Count)
    
    ' Configurar dimensões da nova página (apenas largura por enquanto)
    newPage.SizeWidth = NEW_PAGE_WIDTH
    
    ' Fase 3: Organizar os grupos na nova página em formato grid
    Dim currentX As Double, currentY As Double
    Dim maxRowHeight As Double, maxWidth As Double
    
    ' Posição inicial (considerando a margem)
    currentX = PAGE_MARGIN
    currentY = PAGE_MARGIN
    maxRowHeight = 0
    maxWidth = 0
    
    ' Iterar por todos os grupos coletados
    contador = 0
    For Each group In allGroups
        contador = contador + 1
        
        ' Calcular dimensões do grupo
        Dim groupWidth As Double, groupHeight As Double
        groupWidth = group.SizeWidth
        groupHeight = group.SizeHeight
        
        ' Verificar se o item cabe na linha atual ou precisa ir para próxima linha
        If (currentX + groupWidth) > (NEW_PAGE_WIDTH - PAGE_MARGIN) Then
            ' Mover para próxima linha
            currentX = PAGE_MARGIN
            currentY = currentY + maxRowHeight + GRID_SPACING
            maxRowHeight = 0
        End If
        
        ' Mover grupo para nova posição na nova página
        group.MoveToPage newPage.Index
        group.SetPosition currentX, currentY
        
        ' Atualizar posição para próximo item
        currentX = currentX + groupWidth + GRID_SPACING
        
        ' Atualizar altura máxima da linha atual
        If groupHeight > maxRowHeight Then
            maxRowHeight = groupHeight
        End If
        
        ' Atualizar largura máxima utilizada (para debug)
        If currentX > maxWidth Then
            maxWidth = currentX
        End If
    Next group
    
    ' Calcular altura total necessária
    Dim totalHeight As Double
    totalHeight = currentY + maxRowHeight + PAGE_MARGIN
    
    ' Definir a altura da nova página
    newPage.SizeHeight = totalHeight
    
    ' Fase 4: Apagar as páginas originais
    ' Apagar de trás para frente para evitar problemas de indexação
    For i = numPages To 1 Step -1
        corelDoc.Pages.Item(i).Delete
    Next i
    
    ' Mostrar mensagem de sucesso
    MsgBox "Operação concluída com sucesso!" & vbCrLf & _
           contador & " grupos foram organizados na nova página.", vbInformation
    
    Exit Sub
    
ErrorHandler:
    MsgBox "Ocorreu um erro: " & Err.Description, vbCritical
    Resume Next
End Sub

' Função utilitária para converter milímetros para pontos (unidade interna do CorelDRAW)
Function MmToPoints(mm As Double) As Double
    MmToPoints = mm * 2.83465
End Function

' Função utilitária para converter pontos para milímetros
Function PointsToMm(points As Double) As Double
    PointsToMm = points / 2.83465
End Function

