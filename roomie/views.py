from rest_framework.viewsets import ModelViewSet
from .models import Republica, Usuario, Administrador, Departamento, Despesa, Pagamento, Tarefa, Advertencia, ChatMensagem
from .serializers import RepublicaSerializer, UsuarioSerializer, AdministradorSerializer, DepartamentoSerializer, DespesaSerializer, PagamentoSerializer, TarefaSerializer, AdvertenciaSerializer, ChatMensagemSerializer

class RepublicaViewSet(ModelViewSet):
    queryset = Republica.objects.all()
    serializer_class = RepublicaSerializer

class UsuarioViewSet(ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class AdministradorViewSet(ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdministradorSerializer

class DepartamentoViewSet(ModelViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer

class DespesaViewSet(ModelViewSet):
    queryset = Despesa.objects.all()
    serializer_class = DespesaSerializer

class PagamentoViewSet(ModelViewSet):
    queryset = Pagamento.objects.all()
    serializer_class = PagamentoSerializer

class TarefaViewSet(ModelViewSet):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer

class AdvertenciaViewSet(ModelViewSet):
    queryset = Advertencia.objects.all()
    serializer_class = AdvertenciaSerializer


class ChatMensagemViewSet(ModelViewSet):
    queryset = ChatMensagem.objects.all()
    serializer_class = ChatMensagemSerializer

