# =============================================================================
#  Senior Love — reorganisation de la documentation
# -----------------------------------------------------------------------------
#  Utilise Copy-Item puis Remove-Item plutot que Move-Item : les fichiers
#  OneDrive « a la demande » portent l'attribut ReparsePoint, sur lequel
#  Move-Item echoue avec « acces refuse ».
#
#  Lancer depuis n'importe ou :  powershell -ExecutionPolicy Bypass -File .\reorganiser-docs.ps1
#  Le script ne supprime un fichier qu'apres avoir verifie que la copie existe.
# =============================================================================

$racine = "c:\Users\axel9\OneDrive\Desktop\GIT\PRO\PROJETS\Senior-Love"
$docs   = Join-Path $racine "docs"

$deplaces = 0
$ignores  = 0

function Deplacer {
    param([string]$Source, [string]$Destination, [string]$Libelle)

    if (-not (Test-Path -LiteralPath $Source)) {
        Write-Host ("   . deja fait ou absent : {0}" -f $Libelle) -ForegroundColor DarkGray
        $script:ignores++
        return
    }
    $dossier = Split-Path $Destination -Parent
    if (-not (Test-Path -LiteralPath $dossier)) {
        New-Item -ItemType Directory -Force -Path $dossier | Out-Null
    }
    try {
        Copy-Item -LiteralPath $Source -Destination $Destination -Force -Recurse -ErrorAction Stop
        if (Test-Path -LiteralPath $Destination) {
            Remove-Item -LiteralPath $Source -Force -Recurse -ErrorAction Stop
            Write-Host ("   OK {0}" -f $Libelle) -ForegroundColor Green
            $script:deplaces++
        } else {
            Write-Host ("   !! copie introuvable, source conservee : {0}" -f $Libelle) -ForegroundColor Yellow
        }
    } catch {
        Write-Host ("   !! echec : {0} — {1}" -f $Libelle, $_.Exception.Message) -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== 1. Livrables ===" -ForegroundColor Cyan

Deplacer "$docs\test\Dossier_professionnel_Axel_Alvarez_DWWM (1).docx" `
         "$docs\livrables\Dossier_professionnel_Axel_Alvarez_DWWM.docx" `
         "Dossier professionnel (.docx)"

Deplacer "$docs\test\Dossier_projet_Senior_Love_Axel_Alvarez (2).docx" `
         "$docs\livrables\Dossier_projet_Senior_Love_Axel_Alvarez.docx" `
         "Dossier projet (.docx, avec illustrations)"

Deplacer "$racine\Dossier_professionnel_Axel_Alvarez_DWWM.pdf" `
         "$docs\livrables\Dossier_professionnel_Axel_Alvarez_DWWM.pdf" `
         "Dossier professionnel (.pdf signe)"

Deplacer "$racine\Soutenance_Senior_Love_Axel_Alvarez.pptx" `
         "$docs\livrables\Soutenance_Senior_Love_Axel_Alvarez.pptx" `
         "Diaporama de soutenance"

Write-Host ""
Write-Host "=== 2. Conception ===" -ForegroundColor Cyan

Deplacer "$docs\diagrammes" "$docs\conception\diagrammes" "diagrammes/ (6 schemas + rendus PNG)"
Deplacer "$docs\wireframes" "$docs\conception\wireframes" "wireframes/ (15 maquettes Whimsical)"

Write-Host ""
Write-Host "=== 3. Reference ===" -ForegroundColor Cyan

Deplacer "$docs\RNCP37674 - TP - Développeur web et web mobile (1).pdf" `
         "$docs\reference\RNCP37674-Developpeur-web-et-web-mobile.pdf" `
         "Fiche RNCP37674"

Write-Host ""
Write-Host "=== 4. Menage des dossiers vides ===" -ForegroundColor Cyan

$candidats = @(
    "$docs\test",
    "$docs\Senior Love Outdated doc\#8 Senior Love",
    "$docs\Senior Love Outdated doc",
    "$docs\archive\versions-precedentes",
    "$docs\archive"
)
foreach ($d in $candidats) {
    if (Test-Path -LiteralPath $d) {
        $reste = @(Get-ChildItem -LiteralPath $d -Recurse -File -Force -ErrorAction SilentlyContinue)
        if ($reste.Count -eq 0) {
            Remove-Item -LiteralPath $d -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host ("   OK supprime : {0}" -f (Split-Path $d -Leaf)) -ForegroundColor Green
        } else {
            Write-Host ("   !! conserve ({0} fichier(s)) : {1}" -f $reste.Count, (Split-Path $d -Leaf)) -ForegroundColor Yellow
            $reste | ForEach-Object { Write-Host ("        - " + $_.Name) -ForegroundColor Yellow }
        }
    }
}

Write-Host ""
Write-Host "=== Resultat ===" -ForegroundColor Cyan
Write-Host ("   {0} element(s) deplace(s), {1} ignore(s)" -f $deplaces, $ignores)
Write-Host ""
Write-Host "Arborescence finale :" -ForegroundColor Cyan
if (Test-Path $docs) {
    Get-ChildItem $docs -Recurse | Sort-Object FullName | ForEach-Object {
        $rel = $_.FullName.Replace("$docs\", "")
        $indent = "  " * ($rel.Split('\').Count - 1)
        if ($_.PSIsContainer) {
            Write-Host ("  {0}[{1}]" -f $indent, $_.Name) -ForegroundColor White
        } else {
            Write-Host ("  {0}{1}  ({2} Ko)" -f $indent, $_.Name, [math]::Round($_.Length / 1KB)) -ForegroundColor Gray
        }
    }
}
Write-Host ""
Write-Host "Termine. Ce script peut maintenant etre supprime." -ForegroundColor Cyan
