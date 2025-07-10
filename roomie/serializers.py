from rest_framework.serializers import ModelSerializer
from .models import Republica, Usuario, Administrador, Departamento, Despesa, Pagamento, Tarefa, Advertencia, ChatMensagem

class RepublicaSerializer(ModelSerializer):
    class Meta:
        model = Republica
        fields = '__all__'

class UsuarioSerializer(ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class AdministradorSerializer(ModelSerializer):
    class Meta:
        model = Administrador
        fields = '__all__'

class DepartamentoSerializer(ModelSerializer):
    class Meta:
        model = Departamento
        fields = '__all__'

class DespesaSerializer(ModelSerializer):
    class Meta:
        model = Despesa
        fields = '__all__'

class PagamentoSerializer(ModelSerializer):
    class Meta:
        model = Pagamento
        fields = '__all__'

class TarefaSerializer(ModelSerializer):
    class Meta:
        model = Tarefa
        fields = '__all__'

class AdvertenciaSerializer(ModelSerializer):
    class Meta:
        model = Advertencia
        fields = '__all__'

class ChatMensagemSerializer(ModelSerializer):
    class Meta:
        model = ChatMensagem
        fields = '__all__'