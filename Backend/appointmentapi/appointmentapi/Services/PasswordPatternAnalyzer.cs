using System.Text.RegularExpressions;

namespace appointmentapi.Services
{
    public class PasswordPatternAnalyzer
    {
        private static readonly string[] SequenciasTeclado =
        {
            "qwertyuiop", "asdfghjkl", "zxcvbnm",
            "1234567890", "0987654321"
        };

        public List<string> DetectarPadroes(string senha, HashSet<string> senhasComuns)
        {
            var padroes = new List<string>();

            if (ContemSequenciaTeclado(senha))
                padroes.Add("Sequência de teclado (ex: qwerty, asdf)");

            if (ContemSequenciaAlfabeticaOuNumerica(senha))
                padroes.Add("Sequência alfabética ou numérica (ex: abcde, 12345)");

            if (ContemRepeticaoExcessiva(senha))
                padroes.Add("Caracteres repetidos em excesso");

            if (ContemDataComum(senha))
                padroes.Add("Padrão de data (ex: ano ou data de nascimento)");

            if (ContemLeetSpeakDeSenhaComum(senha, senhasComuns))
                padroes.Add("Variação disfarçada de senha comum (ex: P@ssw0rd)");

            return padroes;
        }

        private bool ContemSequenciaTeclado(string senha)
        {
            var senhaLower = senha.ToLower();
            foreach (var seq in SequenciasTeclado)
            {
                for (int i = 0; i <= seq.Length - 4; i++)
                {
                    var trecho = seq.Substring(i, 4);
                    if (senhaLower.Contains(trecho))
                        return true;
                }
            }
            return false;
        }

        private bool ContemSequenciaAlfabeticaOuNumerica(string senha)
        {
            for (int i = 0; i < senha.Length - 3; i++)
            {
                bool crescente = true;
                bool decrescente = true;

                for (int j = 0; j < 3; j++)
                {
                    if (senha[i + j + 1] - senha[i + j] != 1) crescente = false;
                    if (senha[i + j] - senha[i + j + 1] != 1) decrescente = false;
                }

                if (crescente || decrescente) return true;
            }
            return false;
        }

        private bool ContemRepeticaoExcessiva(string senha)
        {
            return Regex.IsMatch(senha, @"(.)\1{2,}");
        }

        private bool ContemDataComum(string senha)
        {
            return Regex.IsMatch(senha, @"(19[5-9]\d|20[0-2]\d)") ||
                   Regex.IsMatch(senha, @"(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(19|20)\d{2}");
        }

        private bool ContemLeetSpeakDeSenhaComum(string senha, HashSet<string> senhasComuns)
        {
            var normalizada = senha.ToLower()
                .Replace("@", "a")
                .Replace("4", "a")
                .Replace("3", "e")
                .Replace("1", "i")
                .Replace("!", "i")
                .Replace("0", "o")
                .Replace("$", "s")
                .Replace("5", "s")
                .Replace("7", "t");

            return senhasComuns.Contains(normalizada);
        }
    }
}